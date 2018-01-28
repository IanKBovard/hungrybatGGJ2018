(Phaser => {
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 480;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';
  const PLAYER_CHARACTER_MOVE_SPEED = 4;
  const PLAYER_BULLET_SPEED = 8;
  const SQRT_TWO = Math.sqrt(2);
  const SOUND_THRESHOLD = 200;
  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  let radius = 1000 + game.rnd.integerInRange(1, 10);

  let end;
  let cursors;
  let playerCharacter;
  let playerCharacterFloat;
  let background;
  let titlePage;
  let gameOverMite;
  let gameOverMiteAnimation;
  let gameOverTite;
  let gameOverTiteAnimation;
  let instructionsPage;
  let gameOverTooth;
  let gameOverToothAnimation;

  let themeSong;
  let menuClickSound;
  let toothCrunch;
  let sonarSound;
  let crashSound;
  let slideSound;

  let playerBullets;
  let moth;
  let mothShadow;
  let moth2;
  let mothAnimate;
  let mothAnimate2;
  let toothmathy;
  let toothmathyIdle;
  let goldMoth;
  let goldMothAnimation;

  let bitmap;
  let shadowTexture;
  let lightSprite;

  let updateCount = 20;
  let bulletCountdown = 80;

  function preload() {
    game.load.audio('theme', '../assets/music/HungryBatMainMP3.mp3');
    game.load.audio('menuClick', '../assets/sounds/Menu_Cursor_Sound.wav');
    game.load.audio('toothCrunch', '../assets/sounds/Monster_Crunch_Sound.wav');
    game.load.audio('sonar', '../assets/sounds/Sonar_Sound.wav');
    game.load.audio('crash', '../assets/sounds/Stalactite_Hurt_Sound.wav');
    game.load.audio('slide', '../assets/sounds/Bat_Falls.wav');

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
    game.load.spritesheet('gameOverTooth', '../assets/gameOverTooth.png', 640, 480);
    game.load.spritesheet('gameOverTite', '../assets/gameOverTite.png', 640, 480);
    game.load.image('tutorial', '../assets/tutorial.png');
    game.load.physics('physicsData', '../assets/sprite_physics.json');
    game.load.image('title', '../assets/startscreen.jpg');
    game.load.image('gameOver', '../assets/game_over.png');
    game.load.spritesheet('goldMoth', '../assets/goldmoth.png', 17, 18);
    game.load.spritesheet('gameOverMite', '../assets/gameOverMite.png', 640, 480);
  }

  function create() {
    game.world.setBounds(0, 0, 1280, 480);
    background = game.add.sprite(0, 0, 'background');
    cursors = game.input.keyboard.createCursorKeys();
    cursors.fire = game.input.keyboard.addKey(Phaser.KeyCode.SPACEBAR);
    cursors.fire.onUp.add(handlePlayerFire);
    console.log('aslkdjlasf',cursors);
    themeSong = game.add.audio('theme', .5);
    menuClickSound = game.add.audio('menuClick', 3);
    toothCrunch = game.add.audio('toothCrunch', 6, 10);
    sonarSound = game.add.audio('sonar', 1.5);
    crashSound = game.add.audio('crash', 5);
    themeSong.play();

    moth = game.add.sprite(300, 350, 'moth', 0);
    moth2 = game.add.sprite(600, 250, 'moth', 0);
    goldMoth = game.add.sprite(1200, 90, 'goldMoth', 0);
    toothmathy = game.add.sprite(1175, 325, 'meatballmonster', 0);

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

    shadowTexture = game.add.bitmapData(1360, 480);

    lightSprite = game.add.image(game.camera.x, game.camera.y, shadowTexture);
    lightSprite.blendMode = Phaser.blendModes.MULTIPLY;

    game.physics.startSystem(Phaser.Physics.P2JS);
    game.physics.p2.restitution = 0.8;
    game.physics.p2.setImpactEvents(true);

    playerBullets = game.add.group();
    playerBulletsLight = game.add.group();
    playerBulletsLight.lifespan = 400;
    playerCharacter = game.add.sprite(60, 200, GFX, 0);

    game.physics.p2.enable([ titeSmall, titeMedium, titeLarge, titeSmall2, titeMedium2, titeLarge2, titeSmall3, titeMedium3, miteSmall, miteMedium, miteLarge, miteSmall2, miteMedium2, miteLarge2, playerCharacter, playerBullets, moth, moth2, goldMoth,toothmathy ]);

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
    goldMoth.body.clearShapes();
    goldMoth.body.loadPolygon('physicsData', 'moth');

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
    goldMothAnimation = goldMoth.animations.add('goldMothIdle');
    goldMoth.animations.play('goldMothIdle', 15, true);
    toothmathyIdle = toothmathy.animations.add('toothIdle');
    toothmathy.animations.play('toothIdle', 8, true);

    game.camera.follow(playerCharacter);
    playerCharacter.body.onBeginContact.add(blockHit, this);
    titlePage = game.add.button(0, 0, 'title', actionOnClick);
  }
  function actionOnClick(){
    menuClickSound.play();
    titlePage.kill();
    instructionsPage = game.add.button(0, 0, 'tutorial', onClick);
  }
 function onClick(){
  menuClickSound.play();
  instructionsPage.kill();
 }
  function disableKeys(){
    cursors.down.isUp = true;
    cursors.down.enabled = false;

    cursors.up.isUp = true;
    cursors.up.enabled = false;

    cursors.left.isUp = true;
    cursors.left.enabled = false;

    cursors.right.isUp = true;
    cursors.right.enabled = false;
  }
  function blockHit(body){
    if(body){
      switch(true){
        case body.sprite.key === 'titeSmall':
          crashSound.play();
          disableKeys();
          body.sprite.kill();
          gameOverTite = game.add.sprite(0, 0, 'gameOverTite', 0);
          gameOverTite.fixedToCamera = true;
          gameOverTiteAnimation = gameOverTite.animations.add('gameOver2');
          gameOverTite.animations.play('gameOver2', 2.5, false);
          gameOverTite.inputEnabled = true;
          gameOverTite.events.onInputUp.add(() => window.location.reload());
          break;
        case body.sprite.key === 'titeMedium':
          crashSound.play();
          disableKeys();
          body.sprite.kill();
          gameOverTite = game.add.sprite(0, 0, 'gameOverTite', 0);
          gameOverTite.fixedToCamera = true;
          gameOverTiteAnimation = gameOverTite.animations.add('gameOver2');
          gameOverTite.animations.play('gameOver2', 2.5, false);
          gameOverTite.inputEnabled = true;
          gameOverTite.events.onInputUp.add(() => window.location.reload())
          break;
        case body.sprite.key === 'titeLarge':
          crashSound.play();
          disableKeys();
          body.sprite.kill();
          gameOverTite = game.add.sprite(0, 0, 'gameOverTite', 0);
          gameOverTite.fixedToCamera = true;
          gameOverTiteAnimation = gameOverTite.animations.add('gameOver2');
          gameOverTite.animations.play('gameOver2', 2.5, false);
          gameOverTite.inputEnabled = true;
          gameOverTite.events.onInputUp.add(() => window.location.reload())
          break;
        case body.sprite.key === 'miteSmall':
          crashSound.play();
          disableKeys();
          body.sprite.kill();
          gameOverMite = game.add.sprite(0, 0, 'gameOverMite', 0);
          gameOverMite.fixedToCamera = true;
          gameOverMiteAnimation = gameOverMite.animations.add('gameOver1');
          gameOverMite.animations.play('gameOver1', 2.5, false);
          gameOverMite.inputEnabled = true;
          gameOverMite.events.onInputUp.add(() => window.location.reload());
          break;
        case body.sprite.key === 'miteMedium':
          crashSound.play();
          disableKeys();
          body.sprite.kill();
          gameOverMite = game.add.sprite(0, 0, 'gameOverMite', 0);
          gameOverMite.fixedToCamera = true;
          gameOverMiteAnimation = gameOverMite.animations.add('gameOver1');
          gameOverMite.animations.play('gameOver1', 2.5, false);
          gameOverMite.inputEnabled = true;
          gameOverMite.events.onInputUp.add(() => window.location.reload());
          break;
        case body.sprite.key === 'miteLarge':
          crashSound.play();
          disableKeys();
          body.sprite.kill();
          gameOverMite = game.add.sprite(0, 0, 'gameOverMite', 0);
          gameOverMite.fixedToCamera = true;
          gameOverMiteAnimation = gameOverMite.animations.add('gameOver1');
          gameOverMite.animations.play('gameOver1', 2.5, false);
          gameOverMite.inputEnabled = true;
          gameOverMite.events.onInputUp.add(() => window.location.reload());
          break;
        case body.sprite.key === 'moth':
        menuClickSound.play();
          body.sprite.kill();
          break;
        case body.sprite.key === 'meatballmonster':
          toothCrunch.play();
          disableKeys();
          body.sprite.kill();
          gameOverTooth = game.add.sprite(0, 0, 'gameOverTooth', 0);
          gameOverTooth.fixedToCamera = true;
          gameOverToothAnimation = gameOverTooth.animations.add('gameOver3');
          gameOverTooth.animations.play('gameOver3', 2.5, false);
          gameOverTooth.inputEnabled = true;
          gameOverTooth.events.onInputUp.add(() => window.location.reload());
          break;
        case body.sprite.key === 'goldMoth':
          console.log('YOU DID IT!');
          body.sprite.kill();
          break;
      }
    }else{
      console.log('you hit the wall!');
    }
  }
  function update() {
    lightSprite.reset(game.camera.x, game.camera.y);
    updateShadowTexture();

    handlePlayerCharacterMovement();
    handleBulletAnimations();
    removeBulletFromArray();
    resetBulletTimer();

    if (micSwitch) {
      handleMicInputData();
    }
  }
  function updateShadowTexture(){
    shadowTexture.context.fillStyle = 'rgb(0, 0, 0)';
    shadowTexture.context.fillRect(0, 0, 1360, 480);
    let playerCharacterX = playerCharacter.x - game.camera.x;
    let playerCharacterY = playerCharacter.y - game.camera.y;
    let gradientPC = shadowTexture.context.createRadialGradient( playerCharacterX, playerCharacterY, 100 * 0.75, playerCharacterX, playerCharacterY, radius);
    gradientPC.addColorStop(0, 'rgba(255, 255, 255, 1)')
    gradientPC.addColorStop(1, 'rgba(255,255,255,0.0)');
    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradientPC;
    shadowTexture.context.arc(playerCharacterX, playerCharacterY, radius, 0, Math.PI * 2, false);
    shadowTexture.context.fill();
    shadowTexture.dirty = true;

    let mothX = moth.x - game.camera.x;
    let mothY = moth.y - game.camera.y;
    let gradientMoth = shadowTexture.context.createRadialGradient( mothX, mothY, 100 * 0.15, mothX, mothY, radius);
    gradientMoth.addColorStop(0, 'rgba(255, 255, 255, .45)');
    gradientMoth.addColorStop(1, 'rgba(255,255,255,0.0)');
    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradientMoth;
    shadowTexture.context.arc(mothX, mothY, radius, 0, Math.PI * 2, false);
    shadowTexture.context.fill();
    shadowTexture.dirty = true;

    let moth2X = moth2.x - game.camera.x;
    let moth2Y = moth2.y - game.camera.y;
    let gradientMoth2 = shadowTexture.context.createRadialGradient( moth2X, moth2Y, 100 * 0.15, moth2X, moth2Y, radius);
    gradientMoth2.addColorStop(0, 'rgba(255, 255, 255, .45)');
    gradientMoth2.addColorStop(1, 'rgba(255,255,255,0.0)');
    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradientMoth2;
    shadowTexture.context.arc(moth2X, moth2Y, radius, 0, Math.PI * 2, false);
    shadowTexture.context.fill();
    shadowTexture.dirty = true;

    let goldMothX = goldMoth.x - game.camera.x;
    let goldMothY = goldMoth.y - game.camera.y;
    let gradientGoldMoth = shadowTexture.context.createRadialGradient( goldMothX, goldMothY, 100 * 0.55, goldMothX, goldMothY, radius);
    gradientGoldMoth.addColorStop(0, 'rgba(255, 255, 255, .75)');
    gradientGoldMoth.addColorStop(1, 'rgba(255,255,255,0.0)');
    shadowTexture.context.beginPath();
    shadowTexture.context.fillStyle = gradientGoldMoth;
    shadowTexture.context.arc(goldMothX, goldMothY, radius, 0, Math.PI * 2, false);
    shadowTexture.context.fill();
    shadowTexture.dirty = true;

    if(playerBullets.children.length > 0 && playerBullets.children[0].lifespan < 0){
      let bulletX = playerBullets.children[0].x - game.camera.x;
      let bulletY = playerBullets.children[0].y - game.camera.y;
      let gradientBullet = shadowTexture.context.createRadialGradient(bulletX, bulletY, 100 * 0.75, bulletX, bulletY, radius);
      gradientBullet.addColorStop(0, 'rgba(255, 255, 255, 1)');
      gradientBullet.addColorStop(1, 'rgba(255,255,255,0.0)');
      shadowTexture.context.beginPath();
      shadowTexture.context.fillStyle = gradientBullet;
      shadowTexture.context.arc(bulletX, bulletY, radius, 0, Math.PI * 2, false);
      shadowTexture.context.fill();
      shadowTexture.dirty = true;
    }
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
      if(bullet.lifespan > 0){
        bullet.x += PLAYER_BULLET_SPEED;
      }
    });
  }

  function handlePlayerFire() {
    if(playerBullets.children.length === 0){
      sonarSound.play();
      playerBullets.add(game.add.sprite(playerCharacter.x + 10, playerCharacter.y - 25, 'bullets', 0));
      playerBullets.children.forEach(bullet => {
        bullet.lifespan = 250;
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

      if (Math.max(...dataArray) > SOUND_THRESHOLD) {
        handlePlayerFire();
      }
    }
  }
  function removeBulletFromArray(){
    if(playerBullets.children.length > 0 && playerBullets.children[0].lifespan <= 0){
      if(bulletCountdown === 1){
        bulletCountdown--;
        playerBullets.children.splice(0, 1);
      }
      if(bulletCountdown > 1){
        bulletCountdown--
      }
    }
  }
  function resetBulletTimer(){
    if(bulletCountdown === 0){
      bulletCountdown = 80;
    }
  }
})(window.Phaser);