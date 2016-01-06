var my_canvas = document.getElementById('canvas');
var context = my_canvas.getContext("2d");
var circleRadius = 13;
var circleX = my_canvas.width / 2;
var circleY = my_canvas.height - circleRadius;
var dx = 6;
var dy = -6;
var paddleHeight = 10;
var paddleWidth = 100;
var color = getRandomColor();
var paddleX = (my_canvas.width - paddleWidth) / 2;
var rightArrow = false;
var leftArrow = false;
var brickRowCount = 1;
var brickColumnCount = 5;
var brickWidth = 100;
var brickHeight = 20;
var brickPadding = 30;
var brickOffsetTop = 30;
var brickOffsetLeft = 10;
var score = 0;

var bricks = [];
for(i = 0; i < brickColumnCount; i++) {
    bricks[i] = [];
    for(j = 0; j < brickRowCount; j++) {
        bricks[i][j] = { x: 0, y: 0, status: 1 };
    }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.keyCode === 39) {
    rightArrow = true;
  } else if (e.keyCode === 37) {
    leftArrow = true;
  }
}

function keyUpHandler(e) {
  if (e.keyCode === 39) {
    rightArrow = false;
  } else if (e.keyCode === 37) {
    leftArrow = false;
  }
}

function drawScore() {
  context.font = 'roboto slab';
  context.fillStyle = 'black';
  context.fillText("Score: " + score, 550, 15)
}

function collisionCheck() {
    for(i = 0; i < brickColumnCount; i++) {
        for(j = 0; j < brickRowCount; j++) {
            var brick = bricks[i][j];
            if ((circleX > brick.x) && (circleX < brick.x + brickWidth) && (circleY > brick.y) && (circleY < brick.y + brickHeight)) {
                dy = -dy;
                brick.status = -1;
                brick.x = 0;
                brick.y = 0;
                score += 1;
                drawScore();
                if ( score === brickColumnCount * brickRowCount ) {
                        alert("YOU WON! Your score is: " + score);
                        document.location.reload();
                      }
            }
        }
    }
}

function getRandomColor() {
  var letters = '0123456789ABCDEF'.split('');
  var color = '#';
  for (var i = 0; i < 6; i++ ) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function drawCircle() {

  context.beginPath();
  context.arc(circleX, circleY, circleRadius, 0, Math.PI * 2);
  context.fillStyle = color;
  context.fill();
  context.closePath();
}

function drawPaddle() {
  context.beginPath();
  context.rect(paddleX, my_canvas.height - paddleHeight, paddleWidth, paddleHeight);
  context.fillStyle = "#cc00ff";
  context.fill();
  context.closePath();
}

function drawBricks() {
    for(i = 0; i < brickColumnCount; i++) {
        for(j = 0; j < brickRowCount; j++) {
          if (bricks[i][j].status === 1) {
            var brickX = (i * (brickWidth + brickPadding)) + brickOffsetLeft;
            var brickY = (j * (brickHeight + brickPadding)) + brickOffsetTop;
            bricks[i][j].x = brickX;
            bricks[i][j].y = brickY;
            context.beginPath();
            context.rect(brickX, brickY, brickWidth, brickHeight);
            context.fillStyle = "#00ffcc";
            context.fill();
            context.closePath();}
        }
    }
}

function playGame() {
  context.clearRect(0, 0, my_canvas.width, my_canvas.height);
  drawBricks();
  drawCircle();
  drawPaddle();
  drawScore();
  collisionCheck();
  if ( (circleX + dx < circleRadius) || ((circleX + dx) > (my_canvas.width - circleRadius)) ) {
    dx = -dx;
    color = getRandomColor();
  }

  if (circleY + dy < circleRadius) {
    dy = -dy;
    color = getRandomColor();
  } else if ((circleY + dy) > (my_canvas.height - circleRadius)) {
    if ( (circleX + (circleRadius / 2) > paddleX) && (circleX - (circleRadius / 2) < paddleX + paddleWidth) ) {
      dy = -dy;
      color = getRandomColor();
    } else {
      alert("GAME OVER");
      document.location.reload();
    }
  }

  if (leftArrow && paddleX > 0) {
    paddleX -= 10;
  } else if (rightArrow && (paddleX < canvas.width - paddleWidth)) {
    paddleX += 10;
  }

  circleX += dx;
  circleY += dy;
  requestAnimationFrame(playGame);
}

// setInterval(playGame, 10);
playGame();
