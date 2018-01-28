(Phaser => {
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 480;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const BACKGROUND_SCROLL_SPEED = 2;
  const PLAYER_CHARACTER_MOVE_SPEED = 4;
  const PLAYER_BULLET_SPEED = 8;
  const SQRT_TWO = Math.sqrt(2);

/*  const OBSTACLE_SPAWN_FREQ = 100;
  const randomGenerator = new Phaser.RandomDataGenerator();*/

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  let playerCharacter;
  let playerCharacterFloat;
  let cursors;
  let obstacles;
  let background;
  let playerBullets;
  let playerCharacterMask;
  let bulletMask;
  let updateCount = 20;

  function preload() {
    game.load.spritesheet(GFX, '../assets/hungry_bat.png', 100, 100);
    game.load.image('background', '../assets/background.jpg');

    //placeholders
    game.load.spritesheet('bullets', '../assets/spr_bullet_strip04.png', 28, 28);

  }

  function create() {

    background = game.add.sprite(0, 0, 'background');
    background.scale.set(2);
    game.world.setBounds(0, 0, 325, 480);
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    playerCharacterMask = game.add.graphics(0, 0);
    playerCharacterMask.beginFill(0xffffff);
    playerCharacterMask.drawCircle(0, 0);

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0.8;

    obstacles = game.add.group();
    playerBullets = game.add.group();

    playerCharacter = game.add.sprite(60, 200, GFX, 0);
    background.mask = playerCharacterMask;

    game.physics.p2.enable(playerCharacter);
    playerCharacter.body.collideWorldBounds = true;
    playerCharacter.body.fixedRotation = true;
    playerCharacterFloat = playerCharacter.animations.add('idleFloat');
    playerCharacter.animations.play('idleFloat', 12, true);
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
        if(playerCharacter.body.x > 55){
          playerCharacter.body.moveLeft(200 * movingH);
          background.mask.x -= 3.3 * movingH;
        }
        break;
      case cursors.right.isDown:
        if(playerCharacter.body.x < 270){
          playerCharacter.body.moveRight(200 * movingH);
          background.mask.x += 3.3 * movingH;
        }
        break;
    }
    switch(true){
      case cursors.down.isDown:
        if(playerCharacter.body.y < 430){
          playerCharacter.body.moveDown(200 * movingV);
          background.mask.y += 3.3 * movingV;
        }
        break;
      case cursors.up.isDown:
        if(playerCharacter.body.y > 55){
          playerCharacter.body.moveUp(200 * movingV);
          background.mask.y -= 3.3 * movingV;
        }
        break;
    }
  }

  function handleBulletAnimations() {
    playerBullets.children.forEach(bullet => {
      bullet.x += PLAYER_BULLET_SPEED;
      background.mask.x += 9;
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

  function handleMicInputData() {
    // condition reduces number of times analyser will be called
    if (updateCount > 0) {
      updateCount--;
    } else {
      updateCount = 20;
      analyser.getByteTimeDomainData(dataArray);

      if (Math.max(...dataArray) > 200) {
        handlePlayerFire();
      }
    }
  }

  function removeBulletFromArray(){
    if(playerBullets.children.length > 0 && playerBullets.children[0].lifespan < 0){
      console.log(playerBullets.children)
      background.mask.drawCircle(playerBullets.children[0].position.x, playerBullets.children[0].position.y, 100)
      playerBullets.children.splice(0, 1);

    }
  }

  function update() {
    handlePlayerCharacterMovement();
    handleBulletAnimations();

    if (micSwitch) {
      handleMicInputData();
    }

    removeBulletFromArray();
  }

})(window.Phaser);