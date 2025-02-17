import { Scene } from 'phaser';
var player;
var platforms;
var enemies;
var lives = 3;
var livesText;


export class Game extends Scene {
    constructor() {
        super('Game');
    }
    create() {
        // Background
        this.cameras.main.setBackgroundColor("3498db");

        // Platforms
        const gameWidth = this.scale.width;
        const borderHeight = 200;

        // Top Platform
        this.topBorder1 = this.add.image(0, 0, 'platform_asset').setOrigin(0, 0);
        this.topBorder2 = this.add.image(this.topBorder1.width, 0, "platform_asset").setOrigin(0, 0);

        // Bottom Platform
        this.bottomBorder1 = this.add.image(0, this.scale.height - borderHeight, 'platform_asset').setOrigin(0, 0);
        this.bottomBorder2 = this.add.image(this.bottomBorder1.width, this.scale.height - borderHeight, "platform_asset").setOrigin(0, 0);

        // Platform Speed
        this.borderSpeed = 2;

        // Player
        player = this.physics.add.sprite(100, 450, 'player_asset');
        player.setBounce(0);
        player.setCollideWorldBounds(true);
        player.body.setAllowGravity(false);
        this.physics.add.collider(player, platforms);

        // Camera
        // this.cameras.main.setZoom(2);
        this.cameras.main.startFollow(player);
        // this.cameras.main.setPosition(player.x,player.y);

        // Enemy
        enemies = this.physics.add.staticGroup({
            key: 'enemy_asset',
            repeat: 6,
            setXY: { x: 0, y: 150, stepX: 200, stepY: 50 }
        });
        this.physics.add.collider(enemies, platforms);
        this.physics.add.overlap(player, enemies, getHit, null, this);

        // Lives
        livesText = this.add.text(16, 16, ' Lives: 3 ', { fontSize: '32px', fill: '#000' });
    }
    update() {
        this.updatePlatforms();
        this.updatePlayerControls();
    }

    updatePlatforms() {
        // Top and Bottom Platforms
        this.topBorder1.x -= this.borderSpeed;
        this.topBorder2.x -= this.borderSpeed;
        this.bottomBorder1.x -= this.borderSpeed;
        this.bottomBorder2.x -= this.borderSpeed;

        // Reset position when Platforms out of frame
        if (this.topBorder1.x + this.topBorder1.width <= 0) {
            this.topBorder1.x = this.topBorder2.x + this.topBorder2.width;
        }
        if (this.topBorder2.x + this.topBorder2.width <= 0) {
            this.topBorder2.x = this.topBorder1.x + this.topBorder1.width;
        }

        if (this.bottomBorder1.x + this.bottomBorder1.width <= 0) {
            this.bottomBorder1.x = this.bottomBorder2.x + this.bottomBorder2.width;
        }
        if (this.bottomBorder2.x + this.bottomBorder2.width <= 0) {
            this.bottomBorder2.x = this.bottomBorder1.x + this.bottomBorder1.width;
        }
    }

    updatePlayerControls() {
        // Player Controls
        let cursors = this.input.keyboard.createCursorKeys();
        let speed = 100;

        // Left && Right
        if (cursors.left.isDown) {
            player.setVelocityX(-speed);
        }
        else if (cursors.right.isDown) {
            player.setVelocityX(+speed);
        }
        else {
            player.setVelocityX(0);
        }

        // Up && Down
        if (cursors.up.isDown) {
            player.setVelocityY(-speed);
        }
        else if (cursors.down.isDown) {
            player.setVelocityY(speed);
        }

        else {
            player.setVelocityY(0);
        }
    }

}
function getHit(player, enemies) {
    enemies.disableBody(true, true);
    player.setTint(0xff0000);
    this.time.delayedCall(500, () => {
        player.clearTint()
    })
    lives -= 1;
    livesText.setText(' Lives: ' + lives);
    // Game Over
    if (lives == 0) {
        lives = 3;
        this.physics.pause();
        this.scene.start('GameOver')
    };
}
