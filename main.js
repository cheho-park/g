const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

const game = new Phaser.Game(config);

function preload() {
    this.load.image('background', 'assets/background.png');
    this.load.image('balloon', 'assets/balloon.png');
    this.load.image('obstacle', 'assets/obstacle.png');
}

function create() {
    this.add.image(400, 300, 'background');
    this.balloon = this.physics.add.image(400, 500, 'balloon');
    this.balloon.setCollideWorldBounds(true);

    this.cursors = this.input.keyboard.createCursorKeys();

    this.obstacles = this.physics.add.group();
    this.time.addEvent({
        delay: 1000,
        callback: addObstacle,
        callbackScope: this,
        loop: true
    });

    this.score = 0;
    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', fill: '#fff' });

    this.physics.add.collider(this.balloon, this.obstacles, hitObstacle, null, this);
}

function addObstacle() {
    const x = Phaser.Math.Between(50, 750);
    const obstacle = this.obstacles.create(x, 0, 'obstacle');
    obstacle.setVelocityY(200);
}

function hitObstacle(balloon, obstacle) {
    this.physics.pause();
    balloon.setTint(0xff0000);
    this.add.text(400, 300, 'Game Over\nPress R to Restart', { fontSize: '32px', fill: '#fff' }).setOrigin(0.5);
    
    this.input.keyboard.on('keydown-R', () => {
        this.scene.restart();
    });
}

function update() {
    if (this.cursors.left.isDown) {
        this.balloon.setVelocityX(-200);
    } else if (this.cursors.right.isDown) {
        this.balloon.setVelocityX(200);
    } else {
        this.balloon.setVelocityX(0);
    }

    if (this.cursors.up.isDown) {
        this.balloon.setVelocityY(-200);
    } else if (this.cursors.down.isDown) {
        this.balloon.setVelocityY(200);
    } else {
        this.balloon.setVelocityY(0);
    }

    this.obstacles.children.iterate((obstacle) => {
        if (obstacle.y > 600) {
            obstacle.destroy();
            this.score += 10;
            this.scoreText.setText('Score: ' + this.score);
        }
    });
}
