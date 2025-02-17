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
        player = this.physics.add.sprite(100, 450, 'player_asset');
        player.setBounce(0);
        player.setCollideWorldBounds(true);
        player.body.setAllowGravity(false);


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
        this.spawnStars(5);

        this.stars.children.iterate((star) => {
            star.setBounceY(Phaser.Math.FloatBetween(0.4,0.8));
            star.setVelocityX(-150);
        });

        // Colliders
        this.physics.add.overlap(player,this.enemies, getHit, null, this);
        this.physics.add.overlap(player, this.stars, collectStars, null, this);

        // Lives
        livesText = this.add.text(16, 16, ' Lives: 3 ', { fontSize: '32px', fill: '#000' });
        pointsText = this.add.text(16, 40, ' Points: 0 ', { fontSize: '32px', fill: '#000' })
    }
    update() {
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

    spawnEnemies(count) {
        for (let i = 0; i < count; i++) {
            let x = Phaser.Math.Between(800, 1600); // Off-screen to the right
            let y = Phaser.Math.Between(100, this.scale.height - 100); // Random height
    
            let enemy = this.enemies.create(x, y, 'enemy_asset');
            enemy.setVelocityX(-100); // Move left
        }
    }

    spawnStars(count) {
        for (let i = 0; i < count; i++) {
            let x = Phaser.Math.Between(800, 1600);
            let y = Phaser.Math.Between(50, this.scale.height - 50);
    
            let star = this.stars.create(x, y, 'star_asset');
            star.setVelocityX(-100); // Move left
        }
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
function collectStars(player, stars) {
    stars.disableBody(true, true);
    player.setTint('0xFFFF00');
    this.time.delayedCall(500, () => {
        player.clearTint()
    })
    points += 20;
    pointsText.setText(' Points: ' + points);
}
