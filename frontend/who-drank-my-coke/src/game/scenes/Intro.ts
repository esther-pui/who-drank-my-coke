import { Scene } from 'phaser';

const FAST_INTRO = false;
export class Intro extends Scene
{
    constructor ()
    {
        super('Intro');
    }

    create ()
    {
        this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000
        );

        const storyImage =
            this.add.image(
                512,
                384,
                'story'
            );

        storyImage.setDisplaySize(
            1024,
            1400
        );

        storyImage.y = 700;

        // Narration in the middle of the screen
        const narration =
            this.add.text(
                512,
                384,
                '',
                {
                    fontSize: '36px',
                    color: '#ffffff',
                    fontStyle: 'bold',
                    align: 'center',
                    stroke: '#222222',
                    strokeThickness: 6,
                    wordWrap: {
                        width: 800
                    }
                }
            ).setOrigin(0.5);

        // Narration lines
        const lines = [
            'Saturday, 9:30 PM.\nCraving for cola.',
            'A lemon refreshing cola.',
            'I opened the fridge...\nand it shocked me.',
            'WHO DRANK MY COKE?!'
        ];

        if (FAST_INTRO) {
            storyImage.y = 60;
            narration.setText(lines[lines.length - 1]);
            this.showStartButton();
            return;
        }

        let currentLine = 0;

        // Show first line
        narration.setText(
            lines[currentLine]
        );

        currentLine++;

        // Change narration while image is panning
        this.time.addEvent({
            delay: 2000,
            repeat: lines.length - 1,
            callback: () =>
            {
                if (currentLine < lines.length)
                {
                    narration.setText(
                        lines[currentLine]
                    );

                    currentLine++;
                }
            }
        });

        // Fast story pan
        this.tweens.add({
            targets: storyImage,
            y: 60,
            duration: 8000,
            ease: 'Linear',
            onComplete: () =>
            {
                narration.setText(
                    lines[lines.length - 1]
                );

                this.showStartButton();
            }
        });
    }

    showStartButton()
    {
        const startButton =
            this.add.text(
                512,
                500,
                '[ START GAME ]',
                {
                    fontSize: '28px',
                    color: '#ffffff',
                    backgroundColor: '#222222',
                    padding: {
                        x: 30,
                        y: 15
                    }
                }
            ).setOrigin(0.5);

        startButton.setInteractive({
            useHandCursor: true
        });

        startButton.on(
            'pointerdown',
            () =>
            {
                this.scene.start('Game');
            }
        );
    }
}