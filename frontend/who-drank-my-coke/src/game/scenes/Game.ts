import { GameObjects, Scene } from 'phaser';

const API_URL = import.meta.env.VITE_API_URL;

export class Game extends Scene
{
    gameId: string | null = null;
    discoveredClues: string[] = [];
    kitchenBackground: GameObjects.Image | null = null;

    // Dialogue UI
    dialogueText: GameObjects.Text | null = null;
    dialoguePanel: GameObjects.Rectangle | null = null;
    characterImage: GameObjects.Image | null = null;
    characterNameText: GameObjects.Text | null = null;
    playerInput: HTMLInputElement | null = null;

    currentCharacter: string | null = null;

    // Investigation UI
    investigationImage: GameObjects.Image | null = null;
    investigationTitle: GameObjects.Text | null = null;
    investigationDescription: GameObjects.Text | null = null;

    // Accusation UI
    accusationOverlay: GameObjects.Rectangle | null = null;
    accusationImage: GameObjects.Image | null = null;
    accusationCharacter: string | null = null;

    // Things on the main kitchen screen
    baseGameObjects: GameObjects.GameObject[] = [];

    constructor ()
    {
        super('Game');
    }

    // =========================================================
    // CREATE
    // =========================================================

    create ()
    {
        // Grand kitchen background
        this.kitchenBackground =
            this.add.image(
                512,
                384,
                'kitchen'
            );

        this.kitchenBackground.setDisplaySize(
            1024,
            768
        );

        // Create clickable areas
        this.createGameUI();

        // Start backend game
        this.startGame();
    }

    // =========================================================
    // START GAME
    // =========================================================

    async startGame()
    {
        try
        {
            const response = await fetch(
                `${API_URL}/game/start`,
                {
                    method: 'POST'
                }
            );

            const data = await response.json();

            this.gameId = data.game_id;
            this.discoveredClues =
                data.discovered_clues || [];

            console.log(
                'Game started:',
                data
            );
        }
        catch (error)
        {
            console.error(
                'Could not start game:',
                error
            );
        }
    }

    // =========================================================
    // MAIN GAME UI
    // =========================================================

    createGameUI()
    {
        // Clear old hitboxes/buttons
        this.baseGameObjects.forEach(
            (object) =>
            {
                object.destroy();
            }
        );

        this.baseGameObjects = [];

        // -----------------------------------------------------
        // WITCH
        // -----------------------------------------------------
        // Red
        //
        // Two boxes because part of the Witch is covered
        // by the Cat in the artwork.
        //

        this.createHitbox(
            400,
            550,
            130,
            180,
            'witch',
            0xff0000
        );

        this.createHitbox(
            380,
            210,
            200,
            400,
            'witch',
            0xff0000
        );


        // -----------------------------------------------------
        // ROBOT
        // -----------------------------------------------------
        // Blue
        //

        this.createHitbox(
            740,
            350,
            170,
            560,
            'robot',
            0x0066ff
        );


        // -----------------------------------------------------
        // CAT
        // -----------------------------------------------------
        // Green
        //

        this.createHitbox(
            200,
            550,
            260,
            280,
            'cat',
            0x00cc66
        );


        // -----------------------------------------------------
        // FRIDGE
        // -----------------------------------------------------
        // Purple
        //
        // Three boxes because the fridge is tall.
        //

        this.createHitbox(
            560,
            80,
            120,
            80,
            'fridge',
            0x9933ff,
            true
        );

        this.createHitbox(
            550,
            290,
            60,
            180,
            'fridge',
            0x9933ff,
            true
        );

        this.createHitbox(
            520,
            500,
            80,
            100,
            'fridge',
            0x9933ff,
            true
        );


        // -----------------------------------------------------
        // COUNTER / COKE
        // -----------------------------------------------------
        // Yellow
        //

        this.createHitbox(
            590,
            670,
            130,
            100,
            'counter',
            0xffcc00,
            true
        );


        // -----------------------------------------------------
        // FLOOR / PAW PRINTS
        // -----------------------------------------------------
        // Orange
        //

        this.createHitbox(
            450,
            690,
            150,
            100,
            'floor',
            0xff8800,
            true
        );


        // -----------------------------------------------------
        // ACCUSE BUTTON
        // -----------------------------------------------------

        const accuseButton = this.add.text(
            875,
            710,
            '[ ACCUSE ]',
            {
                fontSize: '20px',
                color: '#ffffff',
                backgroundColor: '#222222',
                padding: {
                    x: 15,
                    y: 10
                }
            }
        ).setOrigin(0.5);

        accuseButton.setInteractive({
            useHandCursor: true
        });

        accuseButton.on(
            'pointerdown',
            () =>
            {
                this.accuse();
            }
        );

        this.baseGameObjects.push(
            accuseButton
        );
    }

    // =========================================================
    // CREATE HITBOX
    // =========================================================

    createHitbox(
        x: number,
        y: number,
        width: number,
        height: number,
        target: string,
        color: number,
        isObject: boolean = false
    )
    {
        
        const hitbox = this.add.rectangle(
            x,
            y,
            width,
            height,
            color,
            0 // adjust mask opacity here
        );

        hitbox.setInteractive({
            useHandCursor: true
        });

        hitbox.on(
            'pointerdown',
            () =>
            {
                if (isObject)
                {
                    this.inspectObject(target);
                }
                else
                {
                    this.talkToCharacter(target);
                }
            }
        );

        this.baseGameObjects.push(
            hitbox
        );
    }

    // =========================================================
    // TALK TO CHARACTER
    // =========================================================

    async talkToCharacter(
        character: string
    )
    {
        if (!this.gameId)
        {
            console.log(
                'Game has not started yet.'
            );

            return;
        }

        this.currentCharacter =
            character;

        this.openDialogue(
            character
        );
    }

    // =========================================================
    // OPEN DIALOGUE
    // =========================================================

    openDialogue(
        character: string
    )
    {
        this.hideGameBoard();

        // Dark overlay
        this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000,
            0.75
        );

        // Character image
        this.characterImage =
            this.add.image(
                512,
                285,
                `${character}_talk`
            );

        this.characterImage.setDisplaySize(
            420,
            420
        );

        // Character name
        this.characterNameText =
            this.add.text(
                512,
                65,
                character.toUpperCase(),
                {
                    fontSize: '32px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

        // Dialogue panel
        this.dialoguePanel =
            this.add.rectangle(
                512,
                600,
                850,
                220,
                0xffffff
            );

        this.dialoguePanel.setStrokeStyle(
            3,
            0x333333
        );

        // Character response
        this.dialogueText =
            this.add.text(
                512,
                545,
                'What do you want to ask me?',
                {
                    fontSize: '22px',
                    color: '#222222',
                    align: 'center',
                    wordWrap: {
                        width: 760
                    }
                }
            ).setOrigin(0.5);

        // Input
        this.createInput();

        // Close button
        const closeButton =
            this.add.text(
                900,
                65,
                '[ CLOSE ]',
                {
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: '#222222',
                    padding: {
                        x: 12,
                        y: 8
                    }
                }
            ).setOrigin(0.5);

        closeButton.setInteractive({
            useHandCursor: true
        });

        closeButton.on(
            'pointerdown',
            () =>
            {
                this.closeDialogue();
            }
        );
    }

    // =========================================================
    // CREATE INPUT
    // =========================================================

    createInput()
    {
        if (this.playerInput)
        {
            this.playerInput.remove();
        }

        const input =
            document.createElement('input');

        input.type = 'text';
        input.placeholder =
            'Ask something...';

        input.style.position =
            'absolute';

        input.style.width =
            '500px';

        input.style.height =
            '42px';

        input.style.fontSize =
            '18px';

        input.style.padding =
            '8px 12px';

        input.style.border =
            '2px solid #333';

        input.style.borderRadius =
            '6px';

        input.style.boxSizing =
            'border-box';

        input.style.background =
            '#ffffff';

        input.style.color =
            '#222222';

        input.style.zIndex =
            '1000';

        document.body.appendChild(
            input
        );

        this.playerInput =
            input;

        this.positionInput();

        input.focus();

        input.addEventListener(
            'keydown',
            (event) =>
            {
                if (event.key === 'Enter')
                {
                    this.sendMessage();
                }
            }
        );

        // Send button
        const sendButton =
            this.add.text(
                800,
                650,
                '[ SEND ]',
                {
                    fontSize: '20px',
                    color: '#ffffff',
                    backgroundColor: '#222222',
                    padding: {
                        x: 18,
                        y: 10
                    }
                }
            ).setOrigin(0.5);

        sendButton.setInteractive({
            useHandCursor: true
        });

        sendButton.on(
            'pointerdown',
            () =>
            {
                this.sendMessage();
            }
        );
    }

    // =========================================================
    // POSITION INPUT
    // =========================================================

    positionInput()
    {
        if (!this.playerInput)
        {
            return;
        }

        const canvas =
            this.game.canvas;

        const rect =
            canvas.getBoundingClientRect();

        const scaleX =
            rect.width / 1024;

        const scaleY =
            rect.height / 768;

        this.playerInput.style.left =
            `${rect.left + (262 * scaleX)}px`;

        this.playerInput.style.top =
            `${rect.top + (630 * scaleY)}px`;

        this.playerInput.style.transformOrigin =
            'top left';

        this.playerInput.style.transform =
            `scale(${scaleX}, ${scaleY})`;
    }

    // =========================================================
    // SEND MESSAGE
    // =========================================================

    async sendMessage()
    {
        if (
            !this.gameId ||
            !this.currentCharacter
        )
        {
            return;
        }

        if (!this.playerInput)
        {
            return;
        }

        const message =
            this.playerInput.value.trim();

        if (!message)
        {
            return;
        }

        try
        {
            const response =
                await fetch(
                    `${API_URL}/game/${this.gameId}/message`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            character:
                                this.currentCharacter,
                            message:
                                message
                        })
                    }
                );

            const data =
                await response.json();

            console.log(
                'Character response:',
                data
            );

            if (this.dialogueText)
            {
                this.dialogueText.setText(
                    `${this.currentCharacter}: ${data.response}`
                );
            }

            this.playerInput.value = '';

            this.playerInput.focus();
        }
        catch (error)
        {
            console.error(
                'Could not talk to character:',
                error
            );
        }
    }

    // =========================================================
    // CLOSE DIALOGUE
    // =========================================================

    closeDialogue()
    {
        if (this.characterImage)
        {
            this.characterImage.destroy();
            this.characterImage = null;
        }

        if (this.characterNameText)
        {
            this.characterNameText.destroy();
            this.characterNameText = null;
        }

        if (this.dialoguePanel)
        {
            this.dialoguePanel.destroy();
            this.dialoguePanel = null;
        }

        if (this.dialogueText)
        {
            this.dialogueText.destroy();
            this.dialogueText = null;
        }

        if (this.playerInput)
        {
            this.playerInput.remove();
            this.playerInput = null;
        }

        this.currentCharacter = null;

        // Remove dialogue overlay and buttons
        this.removeTemporaryObjects();

        this.showGameBoard();
    }

    // =========================================================
    // INSPECT OBJECT
    // =========================================================

    async inspectObject(
        objectId: string
    )
    {
        if (!this.gameId)
        {
            console.log(
                'Game has not started yet.'
            );

            return;
        }

        try
        {
            const response =
                await fetch(
                    `${API_URL}/game/${this.gameId}/inspect`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            object: objectId
                        })
                    }
                );

            const data =
                await response.json();

            this.discoveredClues =
                data.discovered_clues || [];

            console.log(
                'Inspection result:',
                data
            );

            this.showInvestigation(
                objectId,
                data
            );
        }
        catch (error)
        {
            console.error(
                'Could not inspect object:',
                error
            );
        }
    }

    // =========================================================
    // INVESTIGATION MODAL
    // =========================================================

    showInvestigation(
        objectId: string,
        data: any
    )
    {
        this.hideGameBoard();

        // Dark overlay
        this.add.rectangle(
            512,
            384,
            1024,
            768,
            0x000000,
            0.78
        );

        // Title
        this.add.text(
            512,
            70,
            'INVESTIGATE',
            {
                fontSize: '36px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Investigation image
        this.investigationImage =
            this.add.image(
                512,
                300,
                `investigate_${objectId}`
            );

        this.investigationImage.setDisplaySize(
            500,
            350
        );

        // Object name
        const objectNames:
            Record<string, string> =
        {
            fridge: 'The Fridge',
            counter: 'Empty Coke Can',
            floor: 'Paw Prints'
        };

        this.investigationTitle =
            this.add.text(
                512,
                500,
                objectNames[objectId]
                    ?? objectId,
                {
                    fontSize: '28px',
                    color: '#ffffff',
                    fontStyle: 'bold'
                }
            ).setOrigin(0.5);

        // Description
        let description =
            'You found nothing unusual.';

        if (data.clue)
        {
            description =
                data.clue.description;
        }

        this.investigationDescription =
            this.add.text(
                512,
                550,
                description,
                {
                    fontSize: '20px',
                    color: '#ffffff',
                    align: 'center',
                    wordWrap: {
                        width: 750
                    }
                }
            ).setOrigin(0.5);

        // Close button
        const closeButton =
            this.add.text(
                900,
                65,
                '[ CLOSE ]',
                {
                    fontSize: '20px',
                    color: '#ffffff',
                    backgroundColor: '#222222',
                    padding: {
                        x: 20,
                        y: 10
                    }
                }
            ).setOrigin(0.5);

        closeButton.setInteractive({
            useHandCursor: true
        });

        closeButton.on(
            'pointerdown',
            () =>
            {
                this.closeInvestigation();
            }
        );
    }

    // =========================================================
    // CLOSE INVESTIGATION
    // =========================================================

    closeInvestigation()
    {
        if (this.investigationImage)
        {
            this.investigationImage.destroy();

            this.investigationImage = null;
        }

        if (this.investigationTitle)
        {
            this.investigationTitle.destroy();

            this.investigationTitle = null;
        }

        if (this.investigationDescription)
        {
            this.investigationDescription.destroy();

            this.investigationDescription = null;
        }

        this.removeTemporaryObjects();

        this.showGameBoard();
    }

    // =========================================================
    // HIDE GAME BOARD
    // =========================================================

    hideGameBoard()
    {
        this.baseGameObjects.forEach(
            (object) =>
            {
                object.setVisible(false);
            }
        );
    }

    // =========================================================
    // SHOW GAME BOARD
    // =========================================================

    showGameBoard()
    {
        this.baseGameObjects.forEach(
            (object) =>
            {
                object.setVisible(true);
            }
        );
    }

    // =========================================================
    // REMOVE TEMPORARY MODAL OBJECTS
    // =========================================================

    removeTemporaryObjects()
    {
        const children =
            this.children.list.slice();

        children.forEach(
            (child) =>
            {
                if (
                    !this.baseGameObjects.includes(
                        child
                    ) &&
                    child !== this.kitchenBackground &&
                    child !== this.investigationImage &&
                    child !== this.investigationTitle &&
                    child !== this.investigationDescription
                )
                {
                    child.destroy();
                }
            }
        );
    }

    // =========================================================
    // ACCUSE
    // =========================================================

    accuse()
    {
        this.hideGameBoard();

        // Dark overlay
        this.accusationOverlay =
            this.add.rectangle(
                512,
                384,
                1024,
                768,
                0x000000,
                0.80
            );

        // Title
        this.add.text(
            512,
            80,
            'WHO DRANK MY COKE?',
            {
                fontSize: '38px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Subtitle
        this.add.text(
            512,
            135,
            'Choose who you want to accuse.',
            {
                fontSize: '20px',
                color: '#dddddd'
            }
        ).setOrigin(0.5);

        // Witch
        this.createAccusationButton(
            250,
            350,
            'witch'
        );

        // Robot
        this.createAccusationButton(
            512,
            350,
            'robot'
        );

        // Cat
        this.createAccusationButton(
            774,
            350,
            'cat'
        );

        // Cancel
        const cancelButton =
            this.add.text(
                900,
                65,
                '[ CLOSE ]',
                {
                    fontSize: '18px',
                    color: '#ffffff',
                    backgroundColor: '#222222',
                    padding: {
                        x: 12,
                        y: 8
                    }
                }
            ).setOrigin(0.5);

        cancelButton.setInteractive({
            useHandCursor: true
        });

        cancelButton.on(
            'pointerdown',
            () =>
            {
                this.closeAccusation();
            }
        );
    }




    // =========================================================
    // ACCUSATION CHARACTER BUTTON
    // =========================================================

    createAccusationButton(
        x: number,
        y: number,
        character: string
    )
    {
        // Character image
        const image =
            this.add.image(
                x,
                y,
                `${character}_talk`
            );

        image.setDisplaySize(
            210,
            300
        );

        image.setInteractive({
            useHandCursor: true
        });

        image.on(
            'pointerdown',
            () =>
            {
                this.showAccusedCharacter(
                    character
                );
            }
        );

        // Character name
        this.add.text(
            x,
            y + 175,
            character.toUpperCase(),
            {
                fontSize: '20px',
                color: '#ffffff',
                fontStyle: 'bold',
                backgroundColor: '#222222',
                padding: {
                    x: 12,
                    y: 6
                }
            }
        ).setOrigin(0.5);
    }

    // =========================================================
    // SHOW ACCUSED CHARACTER
    // =========================================================

    showAccusedCharacter(
        character: string
    )
    {
        // Remove current accusation UI
        this.children.each(
            (child) =>
            {
                child.setVisible(false);
            }
        );

        this.accusationCharacter =
            character;

        // New overlay
        this.accusationOverlay =
            this.add.rectangle(
                512,
                384,
                1024,
                768,
                0x000000,
                0.65
            );

        // Character name
        this.add.text(
            512,
            70,
            character.toUpperCase(),
            {
                fontSize: '34px',
                color: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);

        // Character image
        this.accusationImage =
            this.add.image(
                512,
                300,
                `${character}_accused`
            );

        this.accusationImage.setDisplaySize(
            420,
            420
        );

        // Message
        this.add.text(
            512,
            525,
            `You are accusing the ${character}.\nAre you sure?`,
            {
                fontSize: '22px',
                color: '#ffffff',
                align: 'center'
            }
        ).setOrigin(0.5);

        // Confirm
        const confirmButton =
            this.add.text(
                430,
                650,
                '[ CONFIRM ]',
                {
                    fontSize: '20px',
                    color: '#ffffff',
                    backgroundColor: '#9b2226',
                    padding: {
                        x: 20,
                        y: 10
                    }
                }
            ).setOrigin(0.5);

        confirmButton.setInteractive({
            useHandCursor: true
        });

        confirmButton.on(
            'pointerdown',
            () =>
            {
                this.confirmAccusation();
            }
        );

        // Cancel
        const cancelButton =
            this.add.text(
                600,
                650,
                '[ CANCEL ]',
                {
                    fontSize: '20px',
                    color: '#ffffff',
                    backgroundColor: '#555555',
                    padding: {
                        x: 20,
                        y: 10
                    }
                }
            ).setOrigin(0.5);

        cancelButton.setInteractive({
            useHandCursor: true
        });

        cancelButton.on(
            'pointerdown',
            () =>
            {
                this.closeAccusation();
            }
        );
    }

    // =========================================================
    // CONFIRM ACCUSATION
    // =========================================================

    async confirmAccusation()
    {
        if (
            !this.gameId ||
            !this.accusationCharacter
        )
        {
            return;
        }

        try
        {
            const response =
                await fetch(
                    `${API_URL}/game/${this.gameId}/accuse`,
                    {
                        method: 'POST',
                        headers: {
                            'Content-Type':
                                'application/json'
                        },
                        body: JSON.stringify({
                            character:
                                this.accusationCharacter
                        })
                    }
                );

            const data =
                await response.json();

            console.log(
                'Accusation result:',
                data
            );

            if (
                data.result === 'correct'
            )
            {
                this.scene.start(
                    'GameOver',
                    {
                        result:
                            'You caught the Coke thief! 🐱🥤'
                    }
                );
            }
            else
            {
                this.scene.start(
                    'GameOver',
                    {
                        result:
                            'Wrong! The real culprit got away...'
                    }
                );
            }
        }
        catch (error)
        {
            console.error(
                'Could not make accusation:',
                error
            );
        }
    }

    // =========================================================
    // CLOSE ACCUSATION
    // =========================================================

    closeAccusation()
    {
        this.accusationCharacter =
            null;

        if (this.accusationImage)
        {
            this.accusationImage.destroy();

            this.accusationImage = null;
        }

        if (this.accusationOverlay)
        {
            this.accusationOverlay.destroy();

            this.accusationOverlay = null;
        }

        // Remove everything except
        // the kitchen background and base UI.
        this.removeTemporaryObjects();

        this.showGameBoard();
    }
}