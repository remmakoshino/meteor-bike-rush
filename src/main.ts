import Phaser from 'phaser';
import './styles/global.css';
import { createGameConfig } from './game/config';

const game = new Phaser.Game(createGameConfig());

declare global {
	interface Window {
		__meteorBikeRushGame?: Phaser.Game;
	}
}

window.__meteorBikeRushGame = game;
