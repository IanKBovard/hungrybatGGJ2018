(Phaser => {
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 480;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const BACKGROUND_SCROLL_SPEED = 2.5;
  const PLAYER_CHARACTER_MOVE_SPEED = 4;
  const PLAYER_BULLET_SPEED = 8;
  const SQRT_TWO = Math.sqrt(2);

/*  const OBSTACLE_SPAWN_FREQ = 100;*/
/*  const randomGenerator = new Phaser.RandomDataGenerator();*/

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
    background = game.add.tileSprite(0, 0, 640, 480, 'background');
    game.world.setBounds(0, 0, 325, 480);
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 1;

    obstacles = game.add.group();

    playerBullets = game.add.group();

    playerCharacter = game.add.sprite(60, 200, GFX, 0);
    game.physics.p2.enable(playerCharacter);
    playerCharacter.body.collideWorldBounds = true;
    playerCharacter.body.fixedRotation = true;
    playerCharacterFloat = playerCharacter.animations.add('idleFloat');
    playerCharacter.animations.play('idleFloat', 15, true);

  }

  function handlePlayerCharacterMovement() {
    playerCharacter.body.setZeroVelocity();
    let movingH = SQRT_TWO;
    let movingV = SQRT_TWO;
    if(cursors.up.isDown || cursors.down.isDown){
      movingH = 1;
    }
    if(cursors.left.isDown || cursors.right.isDown){
      movingV = 1;
    }
    switch(true){
      case cursors.left.isDown:
        playerCharacter.body.moveLeft(200 * movingH);
        break;
      case cursors.right.isDown:
        playerCharacter.body.moveRight(200 * movingH);
    }
    switch(true){
      case cursors.down.isDown:
        playerCharacter.body.moveDown(200 * movingV);
        break;
      case cursors.up.isDown:
        playerCharacter.body.moveUp(200 * movingV);
        break;
    }
  }

  function handleBulletAnimations() {
    playerBullets.children.forEach(bullet => {
      bullet.x += PLAYER_BULLET_SPEED;
    });
  }

  function handlePlayerFire() {
    if(playerBullets.children.length === 0){
      playerBullets.add(game.add.sprite(playerCharacter.x + 10, playerCharacter.y - 10, 'bullets', 0));
      playerBullets.children.forEach(bullet => {
        bullet.lifespan = 300;
      });
    }
  }

  function handleObstacleScroll() {
    obstacles.x -= BACKGROUND_SCROLL_SPEED;
  }

  function handleBackgroundScroll() {
    background.tilePosition.x -= BACKGROUND_SCROLL_SPEED;
  }

  function handleMicInputData() {
    // condition reduces number of times analyser will be called
    if (updateCount > 0) {
      updateCount--;
    } else {
      updateCount = 20;
      analyser.getByteTimeDomainData(dataArray);
      
      if (Math.max(...dataArray) > 225) {
        handlePlayerFire();
      }      
    }
  }

  function killBullet(){
    if(playerBullets.children.length > 0 && playerBullets.children[0].lifespan < 0){
      playerBullets.children.splice(0, 1);
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

    killBullet();
  }

})(window.Phaser);
