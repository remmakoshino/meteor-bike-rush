import Phaser from 'phaser';
import { BIKES } from '../data/bikes';
import { ITEM_DEFINITIONS } from '../data/items';
import { RIDERS } from '../data/riders';
import { TRACKS } from '../data/tracks';
import { AIDriverController } from '../ai/AIDriverController';
import { AudioGenerator } from '../audio/AudioGenerator';
import { BikePhysics } from '../physics/BikePhysics';
import { BikeRenderer } from '../renderers/BikeRenderer';
import { EffectRenderer } from '../renderers/EffectRenderer';
import { TrackRenderer } from '../renderers/TrackRenderer';
import { BoostSystem } from '../systems/BoostSystem';
import { CollisionSystem } from '../systems/CollisionSystem';
import { DriftSystem } from '../systems/DriftSystem';
import { ItemSystem } from '../systems/ItemSystem';
import { LapSystem } from '../systems/LapSystem';
import { PositionSystem } from '../systems/PositionSystem';
import { RaceSystem } from '../systems/RaceSystem';
import { HUD } from '../ui/HUD';
import { Minimap } from '../ui/Minimap';
import { distanceSq } from '../utils/math';
import type { BikeSpec, DriverRuntime, GameFlowContext, RaceInput, RaceState, RiderSpec, TrackDef } from '../types';

const EMPTY_INPUT: RaceInput = {
  throttle: false,
  brake: false,
  turnLeft: false,
  turnRight: false,
  drift: false
};

export class RaceScene extends Phaser.Scene {
  static readonly KEY = 'RaceScene';

  private flow!: GameFlowContext;
  private track!: TrackDef;
  private raceState!: RaceState;
  private drivers: DriverRuntime[] = [];
  private orderedDrivers: DriverRuntime[] = [];
  private driverSprites = new Map<string, Phaser.GameObjects.Container>();
  private aiInputs = new Map<string, RaceInput>();

  private raceSystem = new RaceSystem();
  private bikePhysics = new BikePhysics();
  private aiController = new AIDriverController();
  private boostSystem = new BoostSystem();
  private driftSystem = new DriftSystem();
  private lapSystem = new LapSystem();
  private positionSystem = new PositionSystem();
  private collisionSystem = new CollisionSystem();
  private itemSystem = new ItemSystem();

  private trackRenderer!: TrackRenderer;
  private bikeRenderer!: BikeRenderer;
  private effects!: EffectRenderer;
  private hud!: HUD;
  private minimap!: Minimap;
  private audio = new AudioGenerator();

  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private keys!: {
    w: Phaser.Input.Keyboard.Key;
    a: Phaser.Input.Keyboard.Key;
    s: Phaser.Input.Keyboard.Key;
    d: Phaser.Input.Keyboard.Key;
    shift: Phaser.Input.Keyboard.Key;
    space: Phaser.Input.Keyboard.Key;
  };

  private touchInput = { ...EMPTY_INPUT };
  private consumeItemRequested = false;
  private finishScheduled = false;

  private riderById = new Map<string, RiderSpec>(RIDERS.map((rider) => [rider.id, rider]));
  private bikeById = new Map<string, BikeSpec>(BIKES.map((bike) => [bike.id, bike]));

  constructor() {
    super(RaceScene.KEY);
  }

  create(data: { flow: GameFlowContext }): void {
    this.flow = data.flow;

    const selectedTrack = TRACKS.find((track) => track.id === this.flow.trackId);
    if (!selectedTrack) {
      throw new Error(`Track not found: ${this.flow.trackId}`);
    }
    this.track = selectedTrack;

    this.trackRenderer = new TrackRenderer(this);
    this.itemSystem.reset(this.track);
    this.trackRenderer.draw(this.track);

    this.bikeRenderer = new BikeRenderer(this);
    this.effects = new EffectRenderer(this);
    this.hud = new HUD(this);
    this.minimap = new Minimap(this, this.track);

    this.createDrivers();

    this.raceState = {
      mode: this.flow.mode,
      phase: 'countdown',
      trackId: this.track.id,
      drivers: this.drivers,
      countdownMs: 3100,
      elapsedMs: 0,
      playerId: 'player',
      difficulty: this.flow.difficulty
    };

    this.lapSystem.register(this.drivers);
    this.orderedDrivers = this.positionSystem.update(this.drivers);

    const keyboard = this.input.keyboard;
    if (!keyboard) {
      throw new Error('Keyboard is unavailable');
    }

    this.cursors = keyboard.createCursorKeys();
    this.keys = {
      w: keyboard.addKey('W'),
      a: keyboard.addKey('A'),
      s: keyboard.addKey('S'),
      d: keyboard.addKey('D'),
      shift: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT),
      space: keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE)
    };

    this.createTouchControls();
    this.audio.startRaceBgm();

    this.events.once('shutdown', () => {
      this.audio.stopBgm();
      this.hud.destroy();
      this.minimap.destroy();
      this.trackRenderer.destroy();
    });
  }

  update(_time: number, delta: number): void {
    this.updateCountdown(delta);

    if (this.raceState.phase === 'running') {
      this.raceState.elapsedMs += delta;
      for (const driver of this.drivers) {
        if (!driver.finished) {
          driver.totalTimeMs += delta;
        }
      }
    }

    this.raceSystem.update(this.raceState.phase, {
      capturePlayerInput: () => this.capturePlayerInput(),
      updateAi: () => this.updateAiInputs(),
      updatePhysics: () => this.updateDrivers(delta),
      updateCollisions: () => this.updateCollisions(delta),
      updateItems: () => this.updateItems(delta),
      updatePositions: () => this.updatePositions(),
      updateUi: () => this.updateUi()
    });

    this.checkRaceFinish();
  }

  private createDrivers(): void {
    const availableRiders = [...RIDERS];
    const availableBikes = [...BIKES];

    this.drivers = [];
    this.driverSprites.clear();

    for (let i = 0; i < 8; i += 1) {
      const isPlayer = i === 0;
      const riderId = isPlayer ? this.flow.riderId : availableRiders[(i + 1) % availableRiders.length]!.id;
      const bikeId = isPlayer ? this.flow.bikeId : availableBikes[(i + 2) % availableBikes.length]!.id;
      const grid = this.track.startGrid[i] ?? this.track.startGrid[0]!;

      const driver: DriverRuntime = {
        driverId: isPlayer ? 'player' : `ai_${i}`,
        riderId,
        bikeId,
        isPlayer,
        lap: 1,
        checkpointIndex: 0,
        distanceOnTrack: 0,
        rank: i + 1,
        speed: 0,
        heading: grid.heading,
        driftLevel: 0,
        boostTimerMs: 0,
        stunTimerMs: 0,
        itemSlot: null,
        totalTimeMs: 0,
        lapTimesMs: [],
        finished: false,
        shieldTimerMs: 0,
        position: {
          x: grid.x,
          y: grid.y
        }
      };

      this.drivers.push(driver);

      const rider = this.getRider(driver.riderId);
      const sprite = this.bikeRenderer.createBike(driver.position.x, driver.position.y, Phaser.Display.Color.HexStringToColor(rider.color).color);
      sprite.rotation = driver.heading;
      this.driverSprites.set(driver.driverId, sprite);
    }
  }

  private createTouchControls(): void {
    const { width, height } = this.scale;

    const hold = (x: number, y: number, w: number, h: number, label: string, key: keyof RaceInput): void => {
      const area = this.add.rectangle(x, y, w, h, 0x0f172a, 0.35).setScrollFactor(0).setDepth(400).setInteractive();
      this.add.text(x, y, label, { fontSize: '18px', color: '#f8fafc' }).setOrigin(0.5).setDepth(401).setScrollFactor(0);
      area.on('pointerdown', () => {
        this.touchInput[key] = true;
      });
      area.on('pointerup', () => {
        this.touchInput[key] = false;
      });
      area.on('pointerout', () => {
        this.touchInput[key] = false;
      });
    };

    hold(width - 100, height - 80, 120, 90, '加速', 'throttle');
    hold(100, height - 80, 120, 90, '減速', 'brake');
    hold(90, height - 185, 90, 70, '←', 'turnLeft');
    hold(210, height - 185, 90, 70, '→', 'turnRight');
    hold(width - 220, height - 185, 120, 70, 'ドリフト', 'drift');

    const itemButton = this.add.rectangle(width - 90, 90, 120, 66, 0x1d4ed8, 0.68).setScrollFactor(0).setDepth(400).setInteractive();
    this.add.text(width - 90, 90, '使用', { fontSize: '22px', color: '#e0f2fe' }).setOrigin(0.5).setDepth(401).setScrollFactor(0);
    itemButton.on('pointerdown', () => {
      this.consumeItemRequested = true;
    });
  }

  private updateCountdown(delta: number): void {
    if (this.raceState.phase !== 'countdown') {
      return;
    }

    this.raceState.countdownMs -= delta;
    const remain = Math.ceil(this.raceState.countdownMs / 1000);

    if (this.raceState.countdownMs <= 0) {
      this.raceState.phase = 'running';
      this.hud.setCountdown('GO!');
      this.time.delayedCall(550, () => this.hud.setCountdown(''));
      this.effects.flash(0xffffff, 0.25, 180);
      this.audio.playUiSE();
      return;
    }

    this.hud.setCountdown(String(Math.max(1, remain)));
  }

  private capturePlayerInput(): void {
    const player = this.getPlayer();
    if (!player || player.finished) {
      return;
    }

    const keyThrottle = this.cursors.up.isDown || this.keys.w.isDown;
    const keyBrake = this.cursors.down.isDown || this.keys.s.isDown;
    const keyLeft = this.cursors.left.isDown || this.keys.a.isDown;
    const keyRight = this.cursors.right.isDown || this.keys.d.isDown;
    const keyDrift = this.keys.shift.isDown;

    this.aiInputs.set('player', {
      throttle: keyThrottle || this.touchInput.throttle,
      brake: keyBrake || this.touchInput.brake,
      turnLeft: keyLeft || this.touchInput.turnLeft,
      turnRight: keyRight || this.touchInput.turnRight,
      drift: keyDrift || this.touchInput.drift
    });

    if (Phaser.Input.Keyboard.JustDown(this.keys.space) || this.consumeItemRequested) {
      this.consumeItemRequested = false;
      if (player.itemSlot) {
        const message = this.itemSystem.useItem(player, this.drivers);
        this.hud.showMessage(message);
        this.audio.playUiSE();
      }
    }
  }

  private updateAiInputs(): void {
    for (const driver of this.drivers) {
      if (driver.isPlayer || driver.finished) {
        continue;
      }
      const input = this.aiController.buildInput(driver, this.track, this.flow.difficulty);
      this.aiInputs.set(driver.driverId, input);

      if (driver.itemSlot && Math.random() < 0.0025) {
        this.itemSystem.useItem(driver, this.drivers);
      }
    }
  }

  private updateDrivers(delta: number): void {
    for (const driver of this.drivers) {
      const rider = this.getRider(driver.riderId);
      const bike = this.getBike(driver.bikeId);
      const input = this.aiInputs.get(driver.driverId) ?? EMPTY_INPUT;

      const released = this.driftSystem.update(driver, input.drift, input.turnLeft || input.turnRight, delta);
      if (released > 0) {
        const boostDuration = released === 3 ? 1200 : released === 2 ? 820 : 500;
        this.boostSystem.applyBoost(driver, boostDuration, 1);
        if (driver.isPlayer) {
          this.audio.playBoostSE();
        }
      }

      this.bikePhysics.update(driver, rider, bike, input, delta);

      const nearestIndex = this.findNearestPathIndex(driver.position.x, driver.position.y);
      driver.distanceOnTrack = nearestIndex;

      const lapResult = this.lapSystem.updateDriver(driver, this.track);
      if (lapResult.lapAdvanced && driver.isPlayer && !driver.finished) {
        this.hud.showMessage(`ラップ ${driver.lap - 1} クリア`);
      }

      const sprite = this.driverSprites.get(driver.driverId);
      if (sprite) {
        sprite.x = driver.position.x;
        sprite.y = driver.position.y;
        sprite.rotation = driver.heading;
      }
    }
  }

  private updateCollisions(delta: number): void {
    for (const driver of this.drivers) {
      this.collisionSystem.update(driver, this.track, delta);
    }

    for (let i = 0; i < this.drivers.length; i += 1) {
      for (let j = i + 1; j < this.drivers.length; j += 1) {
        const a = this.drivers[i]!;
        const b = this.drivers[j]!;
        if (a.finished || b.finished) {
          continue;
        }

        if (distanceSq(a.position.x, a.position.y, b.position.x, b.position.y) < 16 * 16) {
          a.speed *= 0.92;
          b.speed *= 0.92;
          if (a.isPlayer || b.isPlayer) {
            this.audio.playHitSE();
          }
        }
      }
    }
  }

  private updateItems(_delta: number): void {
    const now = this.raceState.elapsedMs;

    this.track.itemBoxes.forEach((box, index) => {
      this.trackRenderer.setItemBoxActive(index, this.itemSystem.isItemBoxActive(index, now));

      for (const driver of this.drivers) {
        if (distanceSq(driver.position.x, driver.position.y, box.x, box.y) > 15 * 15) {
          continue;
        }
        const pickup = this.itemSystem.tryPickup(driver, driver.rank, index, this.track, now);
        if (pickup && driver.isPlayer) {
          this.hud.showMessage(pickup);
          this.audio.playUiSE();
        }
      }
    });
  }

  private updatePositions(): void {
    this.orderedDrivers = this.positionSystem.update(this.drivers);
  }

  private updateUi(): void {
    const player = this.getPlayer();
    if (!player) {
      return;
    }

    this.hud.update(player, this.raceState.elapsedMs, this.track.laps);
    this.hud.setItemLabel(player.itemSlot ? ITEM_DEFINITIONS[player.itemSlot].name : 'なし');
    this.minimap.update(this.drivers);
  }

  private checkRaceFinish(): void {
    if (this.finishScheduled) {
      return;
    }

    const player = this.getPlayer();
    if (!player) {
      return;
    }

    if (!player.finished) {
      return;
    }

    this.finishScheduled = true;
    this.hud.showMessage('FINISH!');
    this.audio.stopBgm();

    this.time.delayedCall(1800, () => {
      const result = {
        flow: this.flow,
        finishedOrder: this.orderedDrivers.map((driver) => ({
          driverId: driver.driverId,
          riderId: driver.riderId,
          bikeId: driver.bikeId,
          rank: driver.rank,
          totalTimeMs: driver.totalTimeMs,
          isPlayer: driver.isPlayer
        }))
      };

      this.scene.start('ResultScene', { result });
    });
  }

  private findNearestPathIndex(x: number, y: number): number {
    let bestIndex = 0;
    let bestDistance = Number.POSITIVE_INFINITY;

    this.track.aiPath.forEach((point, index) => {
      const dsq = distanceSq(x, y, point.x, point.y);
      if (dsq < bestDistance) {
        bestDistance = dsq;
        bestIndex = index;
      }
    });

    return bestIndex;
  }

  private getPlayer(): DriverRuntime | undefined {
    return this.drivers.find((driver) => driver.driverId === 'player');
  }

  private getRider(riderId: string): RiderSpec {
    const rider = this.riderById.get(riderId);
    if (!rider) {
      throw new Error(`Unknown rider id: ${riderId}`);
    }
    return rider;
  }

  private getBike(bikeId: string): BikeSpec {
    const bike = this.bikeById.get(bikeId);
    if (!bike) {
      throw new Error(`Unknown bike id: ${bikeId}`);
    }
    return bike;
  }
}
