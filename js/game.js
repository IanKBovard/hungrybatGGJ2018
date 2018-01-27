(Phaser => {
  const GAME_WIDTH = 640;
  const GAME_HEIGHT = 480;
  const GAME_CONTAINER_ID = 'game';
  const GFX = 'gfx';


  const game = new Phaser.Game(GAME_WIDTH, GAME_HEIGHT, Phaser.AUTO, GAME_CONTAINER_ID, { preload, create, update });

  let playerCharacter
  let playerCharacterFloat

  function preload() {
    game.load.spritesheet(GFX, '../assets/mon3_sprite_base.png', 64, 64, 5)
  };

  function create() {
    playerCharacter = game.add.sprite(45, 200, GFX, 0)
    playerCharacterFloat = playerCharacter.animations.add('idleFloat')
    playerCharacter.animations.play('idleFloat', 15, true)
  };

  function update() {

  };

})(window.Phaser);