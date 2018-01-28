(Phaser => {
  const GAME_WIDTH = 1360;
  const GAME_HEIGHT = 480;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const PLAYER_CHARACTER_MOVE_SPEED = 4;
  const PLAYER_BULLET_SPEED = 8;
  const SQRT_TWO = Math.sqrt(2);

  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  let playerCharacter;
  let playerCharacterFloat;
  let cursors;
  let background;
  let playerBullets;
  let playerCharacterMask;
  let updateCount = 20;

  function preload() {
    game.load.spritesheet(GFX, '../assets/hungry_bat.png', 100, 100);
    game.load.image('background', '../assets/background.jpg');
    game.load.image('miteSmall', '../assets/miteSmall.png');
    game.load.image('miteMedium', '../assets/miteMedium.png');
    game.load.image('miteLarge', '../assets/miteLarge.png');

    game.load.image('titeSmall', '../assets/titeSmall.png');
    game.load.image('titeMedium', '../assets/titeMedium.png');
    game.load.image('titeLarge', '../assets/titeLarge.png');
    //placeholders
    game.load.spritesheet('bullets', '../assets/spr_bullet_strip04.png', 28, 28);

  }

  function create() {
    background = game.add.sprite(0, 0, 'background');
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    titeSmall = game.add.sprite(150, 0, 'titeSmall');
    titeMedium = game.add.sprite(250, 0, 'titeMedium');
    titeLarge = game.add.sprite(350, 0, 'titeLarge');

    titeSmall2 = game.add.sprite(700, 0, 'titeSmall');
    titeMedium2 = game.add.sprite(625, 0, 'titeMedium');
    titeLarge2 = game.add.sprite(500, -100, 'titeLarge');

    titeSmall3 = game.add.sprite(1000, 0, 'titeSmall');
    titeMedium3 = game.add.sprite(1100, 0, 'titeMedium');

    miteSmall = game.add.sprite(500, 370, 'miteSmall');
    miteMedium = game.add.sprite(550, 315, 'miteMedium');
    miteLarge = game.add.sprite(150, 270, 'miteLarge');

    miteSmall2 = game.add.sprite(700, 370, 'miteSmall');
    miteMedium2 = game.add.sprite(750, 315, 'miteMedium');
    miteLarge2 = game.add.sprite(900, 270, 'miteLarge');

    playerCharacterMask = game.add.graphics(0, 0);
    playerCharacterMask.beginFill(0xffffff);
    playerCharacterMask.drawCircle(0, 0);

    titeSmall.mask = playerCharacterMask;
    titeMedium.mask = playerCharacterMask;
    titeLarge.mask = playerCharacterMask;

    titeSmall2 .mask = playerCharacterMask;
    titeMedium2.mask = playerCharacterMask;
    titeLarge2.mask = playerCharacterMask;

    titeSmall3.mask = playerCharacterMask;
    titeMedium3.mask = playerCharacterMask;

    miteSmall.mask = playerCharacterMask;
    miteMedium.mask = playerCharacterMask;
    miteLarge.mask = playerCharacterMask;

    miteSmall2.mask = playerCharacterMask;
    miteMedium2.mask = playerCharacterMask;
    miteLarge2.mask = playerCharacterMask;

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
          playerCharacter.body.moveLeft(200 * movingH);
        break;
      case cursors.right.isDown:
          playerCharacter.body.moveRight(200 * movingH);
        break;
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
      background.mask.drawCircle(playerBullets.children[0].previousPosition.x, playerBullets.children[0].previousPosition.y, 150);
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