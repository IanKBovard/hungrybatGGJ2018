(Phaser => {
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 480;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const BACKGROUND_SCROLL_SPEED = 2.5;
  const PLAYER_CHARACTER_MOVE_SPEED = 4;
  const PLAYER_BULLET_SPEED = 8;

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  let playerCharacter;
  let playerCharacterFloat;
  let cursors;
  let obstacles;
  let background;
  let playerBullets;
  let updateCount = 20;

  function preload() {
    game.load.spritesheet(GFX, '../assets/mon3_sprite_base.png', 64, 64, 5);
    game.load.image('background', '../assets/bg_1_1.png');
    game.load.spritesheet('bullets', '../assets/spr_bullet_strip04.png', 28, 28);
  }

  function create() {
    game.stage.backgroundColor = '#2d2d2d';
    background = game.add.tileSprite(0, 0, 4000, 480, 'background');

    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0.8;

    obstacles = game.add.group();

    playerBullets = game.add.group();

    playerCharacter = game.add.sprite(60, 200, GFX, 0);
    game.physics.p2.enable(playerCharacter);
    playerCharacter.body.collideWorldBounds = true;

    playerCharacterFloat = playerCharacter.animations.add('idleFloat');
    playerCharacter.animations.play('idleFloat', 15, true);

  }

  function handlePlayerCharacterMovement() {
    playerCharacter.body.setZeroVelocity();

    let movingH = PLAYER_CHARACTER_MOVE_SPEED;
    switch(true){
      case cursors.down.isDown:
        playerCharacter.body.moveDown(200);
        break;
      case cursors.up.isDown:
        playerCharacter.body.moveUp(200);
        break;
    }
  }

  function handleBulletAnimations() {
    playerBullets.children.forEach(bullet => {
      bullet.x += PLAYER_BULLET_SPEED;
    });
  }

  function handlePlayerFire() {
    playerBullets.add(game.add.sprite(playerCharacter.x + 10, playerCharacter.y - 10, 'bullets', 0));
  }

  function handleObstacleScroll() {
    obstacles.x -= BACKGROUND_SCROLL_SPEED;
  }

  function handleBackgroundScroll() {
    background.tilePosition.x -= BACKGROUND_SCROLL_SPEED;
  }

  function handleMicInputData() {
    if (updateCount > 0) {
      updateCount--;
    } else {
      updateCount = 20;
      analyser.getByteTimeDomainData(dataArray);
      
      if (Math.max(...dataArray) > 200) {
        console.log('AAAAAAAAAAAAAAAHH!');
      }      
    }
  }

  function update() {
    handleBackgroundScroll();
    handlePlayerCharacterMovement();
    handleObstacleScroll();
    handleBulletAnimations();

    if (micSwitch) {
      handleMicInputData();
    }
  }

})(window.Phaser);