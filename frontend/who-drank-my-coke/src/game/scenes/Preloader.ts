import { Scene } from 'phaser';

export class Preloader extends Scene
{
    constructor ()
    {
        super('Preloader');
    }

    init ()
    {
        this.add.image(
            512,
            384,
            'background'
        );

        this.add.rectangle(
            512,
            384,
            468,
            32
        ).setStrokeStyle(
            1,
            0xffffff
        );

        const bar = this.add.rectangle(
            512 - 230,
            384,
            4,
            28,
            0xffffff
        );

        this.load.on(
            'progress',
            (progress: number) =>
            {
                bar.width =
                    4 + (460 * progress);
            }
        );
    }

    preload ()
    {
        this.load.setPath('assets');

        // General assets

        this.load.image(
            'logo',
            'logo.png'
        );

        this.load.image(
            'star',
            'star.png'
        );


        // Characters

        this.load.setPath('assets/characters');

        this.load.image(
            'witch_talk',
            'witch_talk.jpeg'
        );

        this.load.image(
            'witch_accused',
            'witch_accused.jpeg'
        );

        this.load.image(
            'robot_talk',
            'robot_talk.jpeg'
        );

        this.load.image(
            'robot_accused',
            'robot_accused.jpeg'
        );

        this.load.image(
            'cat_talk',
            'cat_talk.jpeg'
        );

        this.load.image(
            'cat_accused',
            'cat_accused.jpeg'
        );


        // Investigation images

        this.load.setPath('assets/objects');

        this.load.image(
            'investigate_fridge',
            'fridge.jpeg'
        );

        this.load.image(
            'investigate_counter',
            'counter.jpeg'
        );

        this.load.image(
            'investigate_floor',
            'floor.jpeg'
        );


        // Kitchen background

        this.load.setPath('assets/backgrounds');

        this.load.image(
            'kitchen',
            'kitchen.jpeg'
        );

        // Game over images

        this.load.setPath('assets/backgrounds');

        this.load.image(
            'win',
            'win.jpeg'
        );

        this.load.image(
            'lose',
            'lose.jpeg'
        );

        this.load.image(
            'story',
            'story.jpeg'
        );
    }

    create ()
    {
        this.scene.start('Intro');
    }
}
