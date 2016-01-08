var game = new Phaser.Game(800, 600, Phaser.AUTO, null, {
  preload: preload, create: create, update: update
});
var minion;
var enemy1;
var enemy2;
var enemyCount = 2;
var trampoline;
var bananas;
var newBanana;
var bananaInfo;
var scoreText;
var potassium = 0;
var minionScore = 0;
var enemyScore = 0;
var lives = 3;
var livesText;
var lifeLostText;
var playing = false;
var startButton;
var level = 1;
var levelText;
var levelUpText;
var alertMessage = function () {
  // console.error('blarg');
    if (enemyCount === 0) {
      alert("Congratulations! Kevin defeated both purple minions!");
    } else if (enemyCount === 1) {
      alert("Good job! Kevin defeated one purple minion!")
    } else {
      alert("Kevin may not have defeated any purple minions, but he got to eat some bananas.")
    }
    location.reload();
}

function preload() {
  game.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
  game.scale.pageAlignHorizontally = true;
  game.scale.pageAlignVertically = true;
  game.stage.backgroundColor = "CFFCFF";
  game.load.image('trampoline', 'img/trampoline.png');
  game.load.image('minion', 'img/smallminion.png');
  game.load.image('banana', 'img/smallbanana.png');
  game.load.spritesheet('button', 'img/button.png', 120, 40);
  game.load.image('enemy1', 'img/purpleminion.png');
  game.load.image('enemy2', 'img/purpleminion.png');
}

function create() {
  game.physics.startSystem(Phaser.Physics.ARCADE);

  initBananas();

  trampoline = game.add.sprite(game.world.width / 2, game.world.height - 5, 'trampoline');
  trampoline.anchor.set(0.5, 1);
  game.physics.enable(trampoline, Phaser.Physics.ARCADE);
  trampoline.body.immovable = true;
  game.physics.arcade.checkCollision.down = false;

  enemy1 = game.add.sprite(-100, 40, 'enemy1');
  game.physics.enable(enemy1, Phaser.Physics.ARCADE);
  enemy1.body.immovable = true;
  enemy1.events.onOutOfBounds.add(endGame, this)

  minion = game.add.sprite(game.world.width * 0.5, game.world.height - 100, 'minion');
  minion.anchor.set(0.5);
  game.physics.enable(minion, Phaser.Physics.ARCADE);
  minion.body.collideWorldBounds = true;
  minion.body.bounce.set(1);
  minion.checkWorldBounds = true;
  minion.events.onOutOfBounds.add(minionLeaveScreen, this);

  textStyle = { font: '14px Arial', fill: '#0095DD' };
  scoreText = game.add.text(game.world.width - 200, 5, 'Potassium: 0mg', textStyle);
  // livesText = game.add.text(10, 5, 'Power surges left: 3', textStyle);
  lifeLostText = game.add.text(game.world.width * 0.5, game.world.height * 0.5, 'Kevin is losing strength, click to continue', textStyle);
  lifeLostText.anchor.set(0.5);
  lifeLostText.visible = false;

  levelUpText = game.add.text(game.world.width * 0.3, game.world.height * 0.5, 'Congratulations! On to the advanced level! Click to begin...', textStyle);
  levelUpText.visible = false;
  levelText = game.add.text(10, 5, 'Level: 1', textStyle);

  startButton = game.add.button(game.world.width * 0.5, game.world.height * 0.5, 'button', startGame, this, 1, 0, 2);
  startButton.anchor.set(0.5);
}

function update() {
  game.physics.arcade.collide(minion, trampoline, minionHitTramp);
  game.physics.arcade.collide(minion, bananas, minionHitBanana);
  game.physics.arcade.overlap(enemy1, bananas, enemyHitBanana, null, this);
  game.physics.arcade.overlap(enemy2, bananas, enemyHitBanana, null, this);
  game.physics.arcade.collide(minion, enemy1, minionHitEnemy);
  game.physics.arcade.collide(minion, enemy2, minionHitEnemy);
  if (playing) {
    trampoline.x = game.input.x || game.world.width * 0.5;
  }
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

function endGame() {
  alertMessage();
  location.reload();
}

function minionHitBanana(minion, banana) {
  banana.destroy();
  potassium += 422;
  minionScore += 422;
  scoreText.setText('Potassium: '+ minionScore + 'mg ');
  if ((enemyScore + potassium) === (bananaInfo.count.row * bananaInfo.count.col * 422 )) {
    setTimeout(function(){
      if (level === 1) {
        levelUp();
      } else {
        endGame();
      }
    }, 100);
  }
}

function minionHitTramp(minion, trampoline) {
    minion.body.velocity.x = -1 * 5 * (trampoline.x - minion.x);
}

function enemyHitBanana(enemy, banana) {
  banana.destroy();
  enemyScore += 422;
  if ((enemyScore + potassium) === (bananaInfo.count.row * bananaInfo.count.col * 422 )) {
    setTimeout(function(){ endGame(); }, 100);
  }
}

function enemyEntersAgain() {
  enemy2 = game.add.sprite(-100, 160, 'enemy2');
  game.physics.enable(enemy2, Phaser.Physics.ARCADE);
  enemy2.body.immovable = true;
  enemy2.body.velocity.set(25, 0);
}

function minionHitEnemy(minion, enemy) {
  if (minionScore >= 1688) {
    enemy.kill();
    minionScore -= 1688;
    enemyCount -= 1;
    scoreText.setText('Potassium: '+ minionScore + 'mg ')
  } else {
    minion.kill();
    alert('Kevin the Minion did not have enough Potassium. He was conquered by the purple minion.')
    location.reload();
  }
}
function levelUp() {
  level += 1;
  levelUpText.visible = true;
  trampoline.reset(game.world.width * 0.5, game.world.height - 5);
  minion.reset(game.world.width * 0.5, game.world.height - 100);
  initBananas();
  enemy1.reset(-100, 40);
  levelText.setText('Level: ' + level);
  minionScore = 0;
  potassium = 0;
  scoreText.setText('Potassium: '+ minionScore + 'mg ');
  game.input.onDown.addOnce(function () {
    minion.body.velocity.set(150, -150);
    enemy1.body.velocity.set(25, 0);
    game.time.events.add(Phaser.Timer.SECOND * 10, enemyEntersAgain, this);
    levelUpText.visible = false;
  }, this);
}

function minionLeaveScreen() {
  alert('Kevin the Minion fell to his death...RIP little minion');
  location.reload();
  // lives -= 1;
  // if (lives) {
  //   livesText.setText('Power surges: ' + lives);
  //   lifeLostText.visible = true;
  //   trampoline.reset(game.world.width * 0.5, game.world.height - 5);
  //   minion.reset(game.world.width * 0.5, game.world.height - 100);
  //   enemy1.reset(-100, 40);
  //   game.input.onDown.addOnce(function () {
  //     lifeLostText.visible = false;
  //     minion.body.velocity.set(150, -150);
  //     enemy1.body.velocity.set(25, 0)
  //   }, this);
  // }
  // else {
  //   alert('Kevin has no more energy to live another day...RIP');
  //   location.reload();
  // }
}

function startGame() {
  startButton.destroy();
  minion.body.velocity.set(150, -150);
  playing = true;
  if (level === 2) {
    enemy1.body.velocity.set(25, 0);
    game.time.events.add(Phaser.Timer.SECOND * 10, enemyEntersAgain, this);
  }
}

// function endGame() {
//   alert('cool it worked!')
// }
