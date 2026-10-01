import { EventBus } from '../EventBus';
import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        const data = this.scene.settings.data as {
            result?: string;
        };

        const result =
            data.result ?? 'Game Over';

        const isWin =
            result.includes('caught');

        // Ending image
        this.add.image(
            512,
            384,
            isWin ? 'win' : 'lose'
        ).setDisplaySize(
            1024,
            768
        );

        // Dark overlay
        this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000,
            0.25
        );

        // Title
        this.add.text(
            512,
            100,
            isWin ? 'YOU WIN!' : 'YOU LOSE!',
            {
                fontSize: '64px',
                color: '#ffffff',
                fontStyle: 'bold',
                stroke: '#222222',
                strokeThickness: 6
            }
        ).setOrigin(0.5);

        // Result message
        this.add.text(
            512,
            600,
            result,
            {
                fontSize: '28px',
                color: '#ffffff',
                fontStyle: 'bold',
                align: 'center',
                wordWrap: {
                    width: 800
                },
                stroke: '#222222',
                strokeThickness: 3
            }
        ).setOrigin(0.5);

        // Try again button
        const retryButton =
            this.add.text(
                512,
                700,
                '[ PLAY AGAIN ]',
                {
                    fontSize: '24px',
                    color: '#ffffff',
                    backgroundColor: '#222222',
                    padding: {
                        x: 20,
                        y: 12
                    }
                }
            ).setOrigin(0.5);

        retryButton.setInteractive({
            useHandCursor: true
        });

        retryButton.on(
            'pointerdown',
            () =>
            {
                this.scene.start('Game');
            }
        );

        EventBus.emit(
            'current-scene-ready',
            this
        );
    }
}