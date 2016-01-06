var game = new Phaser.Game(2400, 1800, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});
var carrot;
var trampoline;
var bananas;
var newBanana;
var bananaInfo;
var scoreText;
var score = 0;
var lives = 5;
var livesText;
var lifeLostText;

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = "FFFFFF";
  game.load.image('carrot', 'img/minion.png');
  game.load.image('trampoline', 'img/trampoline.png');
  game.load.image('banana', 'img/banana.png');
}
function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);
  initBananas();
  carrot = game.add.sprite(game.world.width * 0.5, game.world.height - 25, 'carrot');
  carrot.anchor.set(0.5);
  game.physics.enable(carrot, Phaser.Physics.ARCADE);
  carrot.body.velocity.set(400, -400);
  carrot.body.collideWorldBounds = true;
  carrot.body.bounce.set(1);
  carrot.checkWorldBounds = true;
  carrot.events.onOutOfBounds.add(ballLeaveScreen, this);

  trampoline = game.add.sprite(game.world.width / 2, game.world.height - 5, 'trampoline');
  trampoline.anchor.set(0.5, 1);
  game.physics.enable(trampoline, Phaser.Physics.ARCADE);
  trampoline.body.immovable = true;
  game.physics.arcade.checkCollision.down = false;

  textStyle = { font: '36px Arial', fill: '#0095DD' };
  scoreText = game.add.text(2000, 5, 'Potassium: 0mg', textStyle);
  livesText = game.add.text(5, 5, 'Lives left: 5', textStyle);
  lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Life lost, click to continue', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;
}
function update() {
  game.physics.arcade.collide(carrot, trampoline);
  game.physics.arcade.collide(carrot, bananas, minionHitBanana);
  trampoline.x = game.input.x || game.world.width * 0.5;
  // carrot.x += 1;
  // carrot.y += 1;
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
      top: 200,
      left: 100
    },
    padding: {
      vertical: 250,
      horiz: 300
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

function minionHitBanana(carrot, banana) {
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
    carrot.reset(game.world.width * 0.5, game.world.height - 25);
    trampoline.reset(game.world.width * 0.5, game.world.height - 5);
    game.input.onDown.addOnce(function () {
      lifeLostText.visible = false;
      carrot.body.velocity.set(400, -400);
    }, this);
  }
  else {
    alert('Keving died from malnutrition...hope you are proud of yourself');
    location.reload();
  }
}
