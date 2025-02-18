import { Scene } from 'phaser';
var player;
var platforms;
var enemies;
var lives = 3;
var livesText;
var stars;
var points = 0;
var pointsText;



export class Game extends Scene {
    constructor() {
        super('Game');
    }
    create() {
        // Background
        const gameWidth = this.scale.width;
        const gameHeight = this.scale.height;
        const borderHeight = 20;

        this.cameras.main.setBackgroundColor("3498db");

        this.background1 = this.add.image(0,0,'bg_asset').setOrigin(0,0).setDisplaySize(gameWidth,gameHeight);
        this.background2 = this.add.image(this.background1.width,0,"bg_asset").setOrigin(0,0).setDisplaySize(gameWidth,gameHeight)

        // Scale the platform image to fit game width
        const platformWidth = gameWidth;

        // Top Platform
        this.topBorder1 = this.add.image(0, 0, 'platform_asset').setOrigin(0, 0).setDisplaySize(platformWidth, borderHeight);
        this.topBorder2 = this.add.image(this.topBorder1.width, 0, "platform_asset").setOrigin(0, 0).setDisplaySize(platformWidth, borderHeight);

        // Bottom Platform
        this.bottomBorder1 = this.add.image(0, this.scale.height - borderHeight, 'platform_asset').setOrigin(0, 0).setDisplaySize(platformWidth, borderHeight);
        this.bottomBorder2 = this.add.image(this.bottomBorder1.width, this.scale.height - borderHeight, "platform_asset").setOrigin(0, 0).setDisplaySize(platformWidth, borderHeight);

        // Platform Speed
        this.borderSpeed = 0.5;

        // Player
        this.anims.create({
            key: 'walk-down',
            frames: this.anims.generateFrameNumbers('player_asset', { start:4, end:7}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-up',
            frames: this.anims.generateFrameNumbers('player_asset',{ start:0, end:3}),
            frameRate: 10,
            repeat: -1
        });
        this.anims.create({
            key: 'walk-side',
            frames: this.anims.generateFrameNumbers('player_asset', {start:8,end:11}),
            frameRate: 10,
            repeat: -1
        });
        this.player = this.physics.add.sprite(100,450,'player_asset')
        this.player.setBounce(0);
        this.player.setCollideWorldBounds(true);
        this.player.body.setAllowGravity(false);


        // Camera
        // this.cameras.main.setZoom(2);
        // this.cameras.main.startFollow(player);
        // this.cameras.main.setPosition(player.x,player.y);

        // Enemies Setup (Randomized Spawning)
        this.enemies = this.physics.add.group();
        this.spawnEnemies(6); // Spawn 6 enemies randomly

        // Enemy Velocity
        this.enemies.children.iterate((enemy) => {
            enemy.body.setAllowGravity(false);
            enemy.setVelocityX(-300);
        });

        // Stars
        this.stars = this.physics.add.group()
        this.time.addEvent({
            delay: 1000,
            callback: this.spawnStars,
            callbackScope: this,
            loop: true
        })

        // Colliders
        this.physics.add.overlap(player,this.enemies, getHit, null, this);
        this.physics.add.overlap(player, this.stars, collectStars, null, this);

        // Lives
        livesText = this.add.text(870, 20, ' Lives: 3 ', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black', stroke: '#000000', strokeThickness: 8 });
        pointsText = this.add.text(12, 20, ' Points: 0 ', { fontSize: '32px', fill: '#ffffff', fontFamily: 'Arial Black', stroke: '#000000', strokeThickness: 8 })
    }
    update() {
        this.stars.children.iterate((star) => {
            if (star && star.x < -star.width){
                star.destroy();
            }
        });

        this.updateBackground();
        this.updatePlatforms();
        this.updatePlayerControls();
        this.updateEnemies();
        this.updateStars();
    }

    updateBackground(){
        // Background speed
        this.background1.x -= this.borderSpeed;
        this.background2.x -= this.borderSpeed;

        // Reset position when Background out of frame
        if (this.background1.x + this.background1.width <= 0) {
            this.background1.x = this.background2.x + this.background2.width - 1;
        }
        if (this.background2.x + this.background2.width <= 0) {
            this.background2.x = this.background1.x + this.background1.width - 1;
        }

    }
    updatePlatforms() {
        // Top and Bottom Platforms speed
        this.topBorder1.x -= this.borderSpeed;
        this.topBorder2.x -= this.borderSpeed;
        this.bottomBorder1.x -= this.borderSpeed;
        this.bottomBorder2.x -= this.borderSpeed;

        // Reset position when Platforms out of frame
        if (this.topBorder1.x + this.topBorder1.width <= 0) {
            this.topBorder1.x = this.topBorder2.x + this.topBorder2.width - 1;
        }
        if (this.topBorder2.x + this.topBorder2.width <= 0) {
            this.topBorder2.x = this.topBorder1.x + this.topBorder1.width - 1;
        }
    
        if (this.bottomBorder1.x + this.bottomBorder1.width <= 0) {
            this.bottomBorder1.x = this.bottomBorder2.x + this.bottomBorder2.width - 1;
        }
        if (this.bottomBorder2.x + this.bottomBorder2.width <= 0) {
            this.bottomBorder2.x = this.bottomBorder1.x + this.bottomBorder1.width - 1;
        }
    }
    updatePlayerControls() {
        // Player Controls
        let cursors = this.input.keyboard.createCursorKeys();
        let speed = 200;

        // Left && Right
        if (cursors.left.isDown) {
            this.player.setVelocityX(-speed);
            this.player.anims.play('walk-side',true);
            this.player.setFlipX(true);
        }
        else if (cursors.right.isDown) {
            this.player.setVelocityX(+speed);
            this.player.anims.play('walk-side',true);
            this.player.setFlipX(false);
        }
        else {
            this.player.setVelocityX(0);
            this.player.anims.stop();

        }

        // Up && Down
        if (cursors.up.isDown) {
            this.player.setVelocityY(-speed);
            this.player.anims.play('walk-up',true);
        }
        else if (cursors.down.isDown) {
            this.player.setVelocityY(speed);
            this.player.anims.play('walk-down',true);
        }

        else {
            this.player.setVelocityY(0);
            this.player.anims.stop
        }
    }

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            let x = Phaser.Math.Between(800, 1600); // Off-screen to the right
            let y = Phaser.Math.Between(100, this.scale.height - 100); // Random height
    
            let enemy = this.enemies.create(x, y, 'enemy_asset');
            enemy.setVelocityX(-100); // Move left
        }
    }

    spawnStars(count) {
        let yPosition = Phaser.Math.Between(50, this.scale.height - 50);
        let star = this.stars.create(this.scale.width, yPosition, 'star_asset');
        star.setVelocityX(-200);
        star.setCollideWorldBounds(false);
    }

    updateEnemies() {
        this.enemies.children.iterate((enemy) => {
            if (enemy.x + enemy.width < 0){
                enemy.x = this.scale.width;
                enemy.y = Phaser.Math.Between(30, this.scale.height - 30);
                enemy.setVelocityX(Phaser.Math.Between(-150, -250));
            }
        })
    }
    updateStars() {
        this.stars.children.iterate((star) => {
            if (star.x + star.width < 0){
                star.x = this.scale.width;
                star.y = Phaser.Math.Between(30, this.scale.height - 30);
                star.setVelocityX(Phaser.Math.Between(-150, -250));
            }
        })
    }
}
function getHit(player, enemies) {
    enemies.disableBody(true, true);
    player.setTint(0xff0000);
    let flashCount = 5;
    let flashEvent = this.time.addEvent({
        delay:100,
        repeat:flashCount -1,
        callback: () => {
            player.setTint(player.tintTopLeft === 0xFF0000 ? 0XFFFFFF : 0XFF0000);
        },
        callbackScope: this,
        onComplete: () => {
            player.setTint(0xFFFFFF);
        }
    });
    lives -= 1;
    livesText.setText(' Lives: ' + lives);
    // Game Over
    if (lives == 0) {
        lives = 3;
        this.physics.pause();
        this.cameras.main.fadeOut(1000, 0, 0, 0);
        this.time.delayedCall(1000, () => {
        this.scene.start('GameOver');
        });
        
    };
}
function collectStars(player, stars) {
    stars.disableBody(true, true);
    player.setTint('0xFFFF00');
    this.time.delayedCall(500, () => {
        player.clearTint()
    })
    points += 20;
    pointsText.setText(' Points: ' + points);
}
