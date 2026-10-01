import { Boot } from './scenes/Boot';
import { GameOver } from './scenes/GameOver';
import { Game as MainGame } from './scenes/Game';
import { MainMenu } from './scenes/MainMenu';
import { AUTO, Game, Scale } from 'phaser';
import { Preloader } from './scenes/Preloader';
import { Intro } from './scenes/Intro';

const config: Phaser.Types.Core.GameConfig = {
    type: AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',

    scale: {
        mode: Scale.FIT,
        autoCenter: Scale.CENTER_BOTH,
        parent: 'game-container',
        width: 1024,
        height: 768,
    },
    backgroundColor: '#028af8',
    scene: [
        Boot,
        Preloader,
        MainMenu,
        MainGame,
        GameOver,
        Intro
    ]
};

const StartGame = (parent: string) => {

    const container = document.getElementById(parent);

    if (container) {
        Object.assign(container.style, {
            position: 'fixed',
            inset: '0',
            width: '100%',
            height: '100%',
            overflow: 'hidden',
        });
    }

    const game = new Game({ ...config, parent });

    const refreshScale = () => {
        // wait a frame so the browser has applied the new size first
        requestAnimationFrame(() => game.scale.refresh());
    };

    game.events.once('ready', () => {
        game.scale.refresh();

        requestAnimationFrame(() => {
            requestAnimationFrame(() => {
                document.getElementById(parent)?.classList.add('ready');
            });
        });
    });

    window.addEventListener('resize', refreshScale);
    window.addEventListener('orientationchange', refreshScale);
    window.visualViewport?.addEventListener('resize', refreshScale);

    // clean up listeners when the game is destroyed
    game.events.once('destroy', () => {
        window.removeEventListener('resize', refreshScale);
        window.removeEventListener('orientationchange', refreshScale);
        window.visualViewport?.removeEventListener('resize', refreshScale);
    });

    return game;

}

export default StartGame;
