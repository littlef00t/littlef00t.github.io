var game = new Phaser.Game(800, 600, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});
var minion;
var trampoline;
var bananas;
var newBanana;
var bananaInfo;
var scoreText;
var score = 0;
var lives = 5;
var livesText;
var lifeLostText;
var playing = false;
var startButton;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = "CFFCFF";
  game.load.image('trampoline', 'img/trampoline.png');
  game.load.image('minion', 'img/smallminion.png');
  game.load.image('banana', 'img/smallbanana.png');
  game.load.spritesheet('button', 'img/button.png', 120, 40);
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  initBananas();

  trampoline = game.add.sprite(game.world.width / 2, game.world.height - 5, 'trampoline');
  trampoline.anchor.set(0.5, 1);
  game.physics.enable(trampoline, Phaser.Physics.ARCADE);
  trampoline.body.immovable = true;
  game.physics.arcade.checkCollision.down = false;

  minion = game.add.sprite(game.world.width * 0.5, game.world.height - 100, 'minion');
  minion.anchor.set(0.5);
  game.physics.enable(minion, Phaser.Physics.ARCADE);
  // minion.body.velocity.set(400, -400);
  minion.body.collideWorldBounds = true;
  minion.body.bounce.set(1);
  minion.checkWorldBounds = true;
  minion.events.onOutOfBounds.add(ballLeaveScreen, this);

  textStyle = { font: '14px Arial', fill: '#0095DD' };
  scoreText = game.add.text(game.world.width - 200, 5, 'Potassium: 0mg', textStyle);
  livesText = game.add.text(10, 5, 'Lives left: 5', textStyle);
  lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, click to continue', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;

  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);
}
function update() {
  game.physics.arcade.collide(minion, trampoline);
  game.physics.arcade.collide(minion, bananas, minionHitBanana);
  if (playing) {
    trampoline.x = game.input.x || game.world.width * 0.5;
  }
  // minion.x += 1;
  // minion.y += 1;
}

function initBananas() {
  bananaInfo = {
    width: 50,
    height: 100,
    count: {
      row: 7,
      col: 2
    },
    offset: {
      top: 100,
      left: 100
    },
    padding: {
      vertical: 15,
      horiz: 40
    }
  }

  bananas = game.add.group();
  for (c = 0; c < bananaInfo.count.col; c++) {
    for (r = 0; r < bananaInfo.count.row; r++) {
      var bananaX = (r * (bananaInfo.width + bananaInfo.padding.horiz)) + bananaInfo.offset.left;
      var bananaY = (c * (bananaInfo.height + bananaInfo.padding.vertical)) + bananaInfo.offset.top;
      newBanana = game.add.sprite(bananaX, bananaY, 'banana');
      game.physics.enable(newBanana, Phaser.Physics.ARCADE);
      newBanana.body.immovable = true;
      newBanana.anchor.set(0.5);
      bananas.add(newBanana);
    }
  }

}

function minionHitBanana(minion, banana) {
  banana.kill();
  score += 422;
  scoreText.setText('Potassium: '+ score + 'mg');
  if (score === bananaInfo.count.row * bananaInfo.count.col * 422) {
    alert('Congratulations! Kevin is full of Potassium and ready to go about his minion ways!')
    location.reload();
  }
}

function ballLeaveScreen() {
  lives -= 1;
  if (lives) {
    livesText.setText('Lives: ' + lives);
    lifeLostText.visible = true;
    minion.reset(game.world.width * 0.5, game.world.height - 25);
    trampoline.reset(game.world.width * 0.5, game.world.height - 5);
    game.input.onDown.addOnce(function () {
      lifeLostText.visible = false;
      minion.body.velocity.set(400, -400);
    }, this);
  }
  else {
    alert('Keving died from malnutrition...hope you are proud of yourself');
    location.reload();
  }
}

function startGame() {
  startButton.destroy();
  minion.body.velocity.set(200, -200);
  playing = true;
}
