export class AudioGenerator {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private bgmOsc: OscillatorNode | null = null;

  private ensureContext(): void {
    if (this.ctx) {
      return;
    }
    this.ctx = new AudioContext();
    this.masterGain = this.ctx.createGain();
    this.masterGain.gain.value = 0.15;
    this.masterGain.connect(this.ctx.destination);
  }

  startRaceBgm(): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain || this.bgmOsc) {
      return;
    }

    this.bgmOsc = this.ctx.createOscillator();
    this.bgmOsc.type = 'sawtooth';
    this.bgmOsc.frequency.value = 120;

    const gain = this.ctx.createGain();
    gain.gain.value = 0.02;
    this.bgmOsc.connect(gain);
    gain.connect(this.masterGain);
    this.bgmOsc.start();
  }

  stopBgm(): void {
    if (!this.bgmOsc) {
      return;
    }
    this.bgmOsc.stop();
    this.bgmOsc.disconnect();
    this.bgmOsc = null;
  }

  playBoostSE(): void {
    this.playTone(620, 0.09, 'square');
  }

  playHitSE(): void {
    this.playTone(180, 0.12, 'sawtooth');
  }

  playUiSE(): void {
    this.playTone(880, 0.04, 'triangle');
  }

  private playTone(freq: number, durationSec: number, type: OscillatorType): void {
    this.ensureContext();
    if (!this.ctx || !this.masterGain) {
      return;
    }

    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;

    gain.gain.value = 0.08;
    osc.connect(gain);
    gain.connect(this.masterGain);

    osc.start();
    osc.stop(this.ctx.currentTime + durationSec);
  }
}
