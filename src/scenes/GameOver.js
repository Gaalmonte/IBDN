import { Scene } from 'phaser';

export class GameOver extends Scene
{
    constructor ()
    {
        super('GameOver');
    }

    create ()
    {
        this.cameras.main.setBackgroundColor(0xff0000);

        this.add.image(512, 384, 'background').setAlpha(0.5);

        this.add.text(512, 400, 'Game Over', {
            fontFamily: 'Arial Black', fontSize: 64, color: '#ffffff',
            stroke: '#000000', strokeThickness: 8,
            align: 'center'
        }).setOrigin(0.5);

        let clickText = this.add.text(512, 470, 'Click to restart', {
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

            this.scene.start('MainMenu');

        });
    }
}
