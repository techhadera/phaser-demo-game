import Phaser from 'phaser'

export default class Scene1 extends Phaser.Scene {
  private platforms?: Phaser.Physics.Arcade.StaticGroup;
  private player?: Phaser.Physics.Arcade.Sprite;
  private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
  private stars?: Phaser.Physics.Arcade.Group;
  private scoreText?: Phaser.GameObjects.Text;
  private score = 0;

  constructor() {
    super('Scene1');
  }

  preload() {
    this.load.image('sky', 'images/sky.png');
    this.load.image('platform', 'images/platform.png');
    this.load.image('star', 'images/star.png');
    this.load.image('bomb', 'images/bomb.png');
    this.load.spritesheet('dude', 'images/dude.png', { frameWidth: 32, frameHeight: 48 });
  }

  create() {
    this.add.image(400, 300, 'sky');

    this.platforms = this.physics.add.staticGroup();
    const ground: Phaser.Physics.Arcade.Sprite = this.platforms.create(400, 570, 'platform');
    ground.setScale(2).refreshBody();
    this.platforms.create(600, 400, 'platform');
    this.platforms.create(50, 250, 'platform');
    this.platforms.create(750, 220, 'platform');

    this.player = this.physics.add.sprite(100, 450, 'dude');
    this.player.setBounce(0);
    this.player.setCollideWorldBounds(true);

    this.physics.add.collider(this.player, this.platforms);

    this.anims.create({
      key: 'left',
      frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    this.anims.create({
      key: 'turn',
      frames: [{ key: 'dude', frame: 4 }],
      frameRate: 20
    });

    this.anims.create({
      key: 'right',
      frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
      frameRate: 10,
      repeat: -1
    });

    this.cursors = this.input.keyboard.createCursorKeys();

    this.stars = this.physics.add.group({ key: 'star', repeat: 11, setXY: { x: 12, y: 0, stepX: 70 } });
    this.stars?.children.iterate(child => {
      const c = child as Phaser.Physics.Arcade.Image;
      c.setBounceY(Phaser.Math.FloatBetween(0.1, 0.2));
    });

    this.physics.add.collider(this.stars, this.platforms);

    this.physics.add.overlap(this.player, this.stars, this.collectStar, undefined, this);

    this.scoreText = this.add.text(16, 16, 'Score: 0', { fontSize: '32px', color: '#000' });
  }

  update() {
    if (this.cursors?.left?.isDown) {
      this.player?.setVelocityX(-160);
      this.player?.anims.play('left', true);
    }
    else if (this.cursors?.right?.isDown) {
      this.player?.setVelocityX(160);
      this.player?.anims.play('right', true);
    }
    else {
      this.player?.setVelocityX(0);
      this.player?.anims.play('turn');
    }
    if (this.cursors?.up?.isDown && this.player?.body.touching.down) {
      this.player?.setVelocityY(-330);
    }
  }

  collectStar(player: Phaser.GameObjects.GameObject, star: Phaser.GameObjects.GameObject) {
    const s = star as Phaser.Physics.Arcade.Image;
    s.disableBody(true, true);

    this.score += 10;
    this.scoreText?.setText('Score: ' + this.score);
  }
}
