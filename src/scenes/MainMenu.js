import { Scene } from 'phaser';

export class MainMenu extends Scene
{
    constructor ()
    {
        super('MainMenu');
    }

    create ()
    {
        // this.add.image(512, 384, 'background');
        this.cameras.main.setBackgroundColor("#000000");
        this.add.image(512, 300, 'logo');

        this.add.text(512, 460, 'Main Menu', {
            fontFamily: 'Arial Black', fontSize: 38, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        let clickText = this.add.text(512, 510, 'Click to start', {
            fontFamily: 'Arial Black', fontSize: 28, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        this.time.addEvent({
            delay:500,
            callback: () => {
                clickText.visible = !clickText.visible;
            },
            loop: true
        })

        this.input.once('pointerdown', () => {
            this.cameras.main.fadeOut(1000, 0, 0, 0);
            this.time.delayedCall(1000, () => {
                this.scene.start('Game');
            });
        })
    }
}