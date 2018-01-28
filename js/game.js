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
  let moth;
  let moth2;
  let mothAnimate;
  let mothAnimate2;
  let toothmathy;
  let toothmathyIdle;
  let updateCount = 20;
  let testCount = 120;

  function preload() {
    game.load.spritesheet(GFX, '../assets/hungry_bat.png', 100, 100);
    game.load.image('background', '../assets/background.jpg');
    game.load.image('miteSmall', '../assets/miteSmall.png');
    game.load.image('miteMedium', '../assets/miteMedium.png');
    game.load.image('miteLarge', '../assets/miteLarge.png');
    game.load.image('titeSmall', '../assets/titeSmall.png');
    game.load.image('titeMedium', '../assets/titeMedium.png');
    game.load.image('titeLarge', '../assets/titeLarge.png');
    game.load.spritesheet('bullets', '../assets/sonar.png');
    game.load.spritesheet('moth', '../assets/moth.png', 17, 18);
    game.load.spritesheet('meatballmonster', '../assets/meatballmonster.png', 100, 100);
    game.load.physics('physicsData', '../assets/sprite_physics.json');

  }

  function create() {
    background = game.add.sprite(0, 0, 'background');
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);

    moth = game.add.sprite(300, 350, 'moth', 0);
    moth2 = game.add.sprite(600, 250, 'moth', 0);
    toothmathy = game.add.sprite(1100, 300, 'meatballmonster', 0);

    titeSmall = game.add.sprite(150, 50, 'titeSmall');
    titeMedium = game.add.sprite(275, 100, 'titeMedium');
    titeLarge = game.add.sprite(350, 100, 'titeLarge');

    titeSmall2 = game.add.sprite(700, 80, 'titeSmall');
    titeMedium2 = game.add.sprite(625, 100, 'titeMedium');
    titeLarge2 = game.add.sprite(500, 100, 'titeLarge');

    titeSmall3 = game.add.sprite(1000, 80, 'titeSmall');
    titeMedium3 = game.add.sprite(1100, 100, 'titeMedium');

    miteSmall = game.add.sprite(500, 450, 'miteSmall');
    miteMedium = game.add.sprite(625, 440, 'miteMedium');
    miteLarge = game.add.sprite(150, 400, 'miteLarge');

    miteSmall2 = game.add.sprite(800, 440, 'miteSmall');
    miteMedium2 = game.add.sprite(750, 400, 'miteMedium');
    miteLarge2 = game.add.sprite(1000, 400, 'miteLarge');

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

    moth.mask = playerCharacterMask;
    moth2.mask = playerCharacterMask;

    toothmathy.mask = playerCharacterMask;

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0.8;

    playerBullets = game.add.group();

    playerCharacter = game.add.sprite(60, 200, GFX, 0);
    background.mask = playerCharacterMask;

    game.physics.p2.enable([ titeSmall, titeMedium, titeLarge, titeSmall2, titeMedium2, titeLarge2, titeSmall3, titeMedium3, miteSmall, miteMedium, miteLarge, miteSmall2, miteMedium2, miteLarge2, playerCharacter, playerBullets, moth, moth2, toothmathy ]);


    titeSmall.body.static = true;
    titeMedium.body.static = true;
    titeLarge.body.static = true;

    titeSmall2 .body.static = true;
    titeMedium2.body.static = true;
    titeLarge2.body.static = true;

    titeSmall3.body.static = true;
    titeMedium3.body.static = true;

    miteSmall.body.static = true;
    miteMedium.body.static = true;
    miteLarge.body.static = true;

    miteSmall2.body.static = true;
    miteMedium2.body.static = true;
    miteLarge2.body.static = true;

    playerCharacter.body.clearShapes();
    playerCharacter.body.loadPolygon('physicsData', 'hungry_bat');
    titeSmall.body.clearShapes();
    titeSmall.body.loadPolygon('physicsData', 'titeSmall');
    titeMedium.body.clearShapes();
    titeMedium.body.loadPolygon('physicsData', 'titeMedium');
    titeLarge.body.clearShapes();
    titeLarge.body.loadPolygon('physicsData', 'titeLarge');

    titeSmall2.body.clearShapes();
    titeSmall2.body.loadPolygon('physicsData', 'titeSmall');
    titeMedium2.body.clearShapes();
    titeMedium2.body.loadPolygon('physicsData', 'titeMedium');
    titeLarge2.body.clearShapes();
    titeLarge2.body.loadPolygon('physicsData', 'titeLarge');

    titeSmall3.body.clearShapes();
    titeSmall3.body.loadPolygon('physicsData', 'titeSmall');
    titeMedium3.body.clearShapes();
    titeMedium3.body.loadPolygon('physicsData', 'titeMedium');

    miteSmall.body.clearShapes();
    miteSmall.body.loadPolygon('physicsData', 'miteSmall');
    miteMedium.body.clearShapes();
    miteMedium.body.loadPolygon('physicsData', 'miteMedium');
    miteLarge.body.clearShapes();
    miteLarge.body.loadPolygon('physicsData', 'miteLarge');

    miteSmall2.body.clearShapes();
    miteSmall2.body.loadPolygon('physicsData', 'miteSmall');
    miteMedium2.body.clearShapes();
    miteMedium2.body.loadPolygon('physicsData', 'miteMedium');
    miteLarge2.body.clearShapes();
    miteLarge2.body.loadPolygon('physicsData', 'miteLarge');

    moth.body.clearShapes();
    moth.body.loadPolygon('physicsData', 'moth');

    moth2.body.clearShapes();
    moth2.body.loadPolygon('physicsData', 'moth');

    toothmathy.body.clearShapes();
    toothmathy.body.loadPolygon('physicsData', 'meatballmonster');

    playerCharacter.body.collideWorldBounds = true;
    playerCharacter.body.fixedRotation = true;
    playerCharacterFloat = playerCharacter.animations.add('idleFloat');
    playerCharacter.animations.play('idleFloat', 12, true);

    mothAnimate = moth.animations.add('mothIdle');
    mothAnimate2 = moth2.animations.add('mothIdle2');
    moth.animations.play('mothIdle', 15, true);
    moth2.animations.play('mothIdle2', 15, true);
    toothmathyIdle = toothmathy.animations.add('toothIdle');
    toothmathy.animations.play('toothIdle', 8, true);
  }

  function update() {
    handlePlayerCharacterMovement();
    handleBulletAnimations();
    if (micSwitch) {
      handleMicInputData();
    }
    removeBulletFromArray();
    resetBackground();
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
  function handleCollisions(){

  }
  function handleBulletAnimations() {
    playerBullets.children.forEach(bullet => {
      bullet.x += PLAYER_BULLET_SPEED;
    });
  }

  function handlePlayerFire() {
    if(playerBullets.children.length === 0){
      playerBullets.add(game.add.sprite(playerCharacter.x + 10, playerCharacter.y - 25, 'bullets', 0));
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
  function resetBackground(){
    if(testCount === 0){
      //reset background
    }
    if(testCount > 0){
      testCount--;
    }
  }
})(window.Phaser);