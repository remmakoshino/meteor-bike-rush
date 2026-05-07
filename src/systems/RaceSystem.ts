import type { RacePhase } from '../types';

export interface RaceUpdateHandlers {
  capturePlayerInput: () => void;
  updateAi: () => void;
  updatePhysics: () => void;
  updateCollisions: () => void;
  updateItems: () => void;
  updatePositions: () => void;
  updateUi: () => void;
}

export class RaceSystem {
  update(phase: RacePhase, handlers: RaceUpdateHandlers): void {
    if (phase !== 'running') {
      handlers.updateUi();
      return;
    }

    handlers.capturePlayerInput();
    handlers.updateAi();
    handlers.updatePhysics();
    handlers.updateCollisions();
    handlers.updateItems();
    handlers.updatePositions();
    handlers.updateUi();
  }
}
