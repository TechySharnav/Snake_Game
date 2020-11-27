var w = window.innerWidth;
var h = window.innerHeight;
var msg = document.getElementById("msg");

var scl = 15;

var gameState = 0;
var snakeArr = [];
var fruitArr = [];

var Score = 0;
var rate = 30;
var spawnRate = 150;
var snake, fruit, timeout, body, direction, xdir, ydir, speed, dir;

var vel = { x: 0, y: 0 };
var pos = { x: 0, y: 0 };

var isLeft = false;
var isRight = false;
var isUp = false;
var isDown = false;

function setup() {
  createCanvas(w, h);
  snake = createSprite(w / 2, h / 2, 15, 15);
  snake.shapeColor = "blue";
  snakeArr.push(snake);
  textSize(20);
  fill("#565656");
}

function draw() {
  frameRate(rate);
  background("#C9CACC");

  text("Score: " + Score, w - 100, 50);
  text("HI: " + localStorage.getItem("HighScore"), w - 150, 50);

  if (gameState === 0) {
    snake.x = w / 2;
    snake.y = h / 2;
    text("Press SPACE to Continue", w / 2 - 100, snake.y - 100);

    if (snakeArr.length >= 2) {
      for (var i = 1; i < snakeArr.length; i++) {
        snakeArr[i].remove();
      }
    }
    snakeArr.length = 1;
    if (fruit) {
      fruit.remove();
      fruitArr = [];
    }
  }

  if (gameState === 1) {
    edge = createEdgeSprites();

    snake.collide(edge[0], endGame);
    snake.collide(edge[1], endGame);
    snake.collide(edge[2], endGame);
    snake.collide(edge[3], endGame);

    if (frameCount % 150 === 0 && fruitArr.length === 0) {
      spawnFruit();
      //console.log(snake.touching);
    }

    if (fruit && fruit.overlap(snake) === true) {
      destroyFruit(true);
    }
    /* if (isLeft) {
      snake = snakeArr[0];
    } else if (isRight) {
      snake = snakeArr[snakeArr.length - 1];
    }*/
  }

  if (gameState === 2) {
    if (fruit) {
      clearTimeout(timeout);
    }
    text("Press R to restart", w / 2, h / 2);
  }

  drawSprites();
}

function setDir(x, y) {
  xdir = x;
  ydir = y;
}

function keyPressed() {
  if (gameState === 0 && keyCode === 32) {
    gameState = 1;
    frameCount = 0;
    rate = 30;
    spawnRate = 150;
  }

  if (gameState === 2 && keyCode === 82) {
    gameState = 0;
    Score = 0;
  }

  if (gameState === 1) {
    if (keyCode === LEFT_ARROW && isRight === false) {
      pos = snake.position;
      snake.setVelocity(-w * 0.01, 0);
      setDir(-16, 0);
      isLeft = true;
      isRight = false;
      isUp = false;
      isDown = false;

      for (var i = 1; i < snakeArr.length; i++) {
        snakeArr[i].setVelocity(-w * 0.01, 0);
        snakeArr[i].x = snake.x + i * 16;
        snakeArr[i].y = snake.y;
      }
    } else if (keyCode === RIGHT_ARROW && isLeft === false) {
      pos = snake.position;
      snake.setVelocity(w * 0.01, 0);
      setDir(16, 0);
      isRight = true;
      isLeft = false;
      isUp = false;
      isDown = false;

      for (var i = 0; i < snakeArr.length; i++) {
        snakeArr[i].setVelocity(w * 0.01, 0);
        snakeArr[i].x = snake.x - i * 16;
        snakeArr[i].y = snake.y;
      }
    } else if (keyCode === UP_ARROW && isDown === false) {
      pos = snake.position;
      snake.setVelocity(0, -w * 0.01);
      setDir(0, -16);
      isUp = true;
      isLeft = false;
      isRight = false;
      isDown = false;

      for (var i = 0; i < snakeArr.length; i++) {
        snakeArr[i].setVelocity(0, -w * 0.01);
        snakeArr[i].x = snake.x;
        snakeArr[i].y = snake.y + i * 16;
      }
    } else if (keyCode === DOWN_ARROW && isUp === false) {
      pos = snake.position;
      snake.setVelocity(0, w * 0.01);
      setDir(0, 16);
      isDown = true;
      isUp = false;
      isRight = false;
      isLeft = false;

      for (var i = 0; i < snakeArr.length; i++) {
        snakeArr[i].setVelocity(0, w * 0.01);
        snakeArr[i].x = snake.x;
        snakeArr[i].y = snake.y - i * 16;
      }
    }
  }
  /*pos = snake.position;
  direction = snake.getDirection();
  vel = snakeArr[snakeArr.length - 1].velocity;
  speed = snake.getSpeed();
  dir = snake.getDirection();

  update();*/
}

endGame = () => {
  gameState = 2;
  for (var i = 0; i < snakeArr.length; i++) {
    snakeArr[i].setVelocity(0, 0);
  }
  if (Score > localStorage.getItem("HighScore")) {
    localStorage.setItem("HighScore", Score);
  }
};

spawnFruit = () => {
  fruit = createSprite(random(100, w - 100), random(100, h - 100), 20, 20);
  fruit.shapeColor = "#9E2428";
  fruitArr.push(fruit);

  timeout = setTimeout(() => {
    destroyFruit(null);
  }, 10000);
};

destroyFruit = (param) => {
  fruitArr = [];
  fruit.remove();
  clearTimeout(timeout);
  spawnRate = Math.random() * (180 - 150) + 150;

  if (param === true) {
    Score += 1;
    rate += 1.25;

    grow();
  }
};

grow = () => {
  if (isLeft) {
    body = createSprite(
      snakeArr[snakeArr.length - 1].position.x + 16,
      snakeArr[snakeArr.length - 1].position.y,
      15,
      15
    );
    body.setVelocity(-w * 0.01, 0);
  } else if (isRight) {
    body = createSprite(
      snakeArr[snakeArr.length - 1].position.x - 16,
      snakeArr[snakeArr.length - 1].position.y,
      15,
      15
    );
    body.setVelocity(w * 0.01, 0);
  } else if (isDown) {
    body = createSprite(
      snakeArr[snakeArr.length - 1].position.x,
      snakeArr[snakeArr.length - 1].position.y - 16,
      15,
      15
    );
    body.setVelocity(0, w * 0.01);
  } else if (isUp) {
    body = createSprite(
      snakeArr[snakeArr.length - 1].position.x,
      snakeArr[snakeArr.length - 1].position.y + 16,
      15,
      15
    );
    body.setVelocity(0, -w * 0.01);
  }

  snakeArr.push(body);
};

/*update = () => {
  for (var i = 0; i < snakeArr.length; i++) {
    if (snakeArr[i] === snake) {
      snakeArr[i].shapeColor = "green";
      continue;
    } else {
      snakeArr[i].shapeColor = "grey";
      if (snakeArr[i].x === pos.x) {
        snakeArr[i].setSpeed(snake.getSpeed(), snake.getDirection());
      }
    }
  }
};
*/
