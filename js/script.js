/* CANVAS */
let canvas = document.getElementById('canvas');
let ctx = canvas.getContext('2d');

let W = canvas.width;
let H = canvas.height;









/* SPRITES */
class Sprite {
  constructor(image, width, height, ticksPerFrame, numberOfFrames) {
    this.image = image;
    this.width = width;
    this.height = height;

    this.frameIndex = 0;
    this.tickCount = 0;
    this.ticksPerFrame = ticksPerFrame;
    this.numberOfFrames = numberOfFrames;
  }

  render(x, y) {
    // Draw the animation
    ctx.drawImage(
      this.image,
      this.frameIndex * this.width / this.numberOfFrames,
      0,
      this.width / this.numberOfFrames,
      this.height,
      x,
      y,
      this.width / this.numberOfFrames,
      this.height
    );
  }

  update() {
    this.tickCount++;

    if (this.tickCount > this.ticksPerFrame) {
      this.tickCount = 0;


      // If the current frame index is in range
      if (this.frameIndex < this.numberOfFrames - 1) {
        // go to the next frame
        this.frameIndex++;
      } else {
        this.frameIndex = 0;
      }
    }
  }
}









/* ASSETS */
let mainTitleImg = new Image();
mainTitleImg.src = 'assets/main-title.png';

let rulesGameImg = new Image();
rulesGameImg.src = 'assets/rules.png';

let loadingImg = new Image();
loadingImg.src = 'assets/loading-level.png';

let bgGameImg = new Image();
bgGameImg.src = 'assets/bg-game.png';

let carrotImg = new Image();
carrotImg.src = 'assets/carrot.png';

let ladderImg = new Image();
ladderImg.src = 'assets/ladder.png';

let ground1Img = new Image();
ground1Img.src = 'assets/ground-1.png';

let ground2Img = new Image();
ground2Img.src = 'assets/ground-2.png';

let rabbitLeft = new Image();
rabbitLeft.src = 'assets/rabbitLeft.png';
let rabbitLeft2 = new Image();
rabbitLeft2.src = 'assets/rabbitLeft2.png';
let rabbitRight = new Image();
rabbitRight.src = 'assets/rabbitRight.png';
let rabbitRight2 = new Image();
rabbitRight2.src = 'assets/rabbitRight2.png';
let rabbitUp = new Image();
rabbitUp.src = 'assets/rabbitUp.png';
let rabbitUp2 = new Image();
rabbitUp2.src = 'assets/rabbitUp2.png';
let rabbitDown = new Image();
rabbitDown.src = 'assets/rabbitDown.png';
let rabbitDown2 = new Image();
rabbitDown2.src = 'assets/rabbitDown2.png';

let rabbitWalkLeft = new Image();
rabbitWalkLeft.src = 'assets/rabbit-walk-left.png';
let rabbitWalkRight = new Image();
rabbitWalkRight.src = 'assets/rabbit-walk-right.png';
let rabbitClimbUp = new Image();
rabbitClimbUp.src = 'assets/rabbit-climb-up.png'
let rabbitClimbDown = new Image();
rabbitClimbDown.src = 'assets/rabbit-climb-down.png'

let foxWalkLeft = new Image();
foxWalkLeft.src = 'assets/fox-walk-left.png';

let foxWalkRight = new Image();
foxWalkRight.src = 'assets/fox-walk-right.png';

let winGameImg = new Image();
winGameImg.src = 'assets/win-game.png';
let cloudImg = new Image();
cloudImg.src = 'assets/cloud.png';
let bgWinGameImg = new Image();
bgWinGameImg.src = 'assets/bg-win-game.png';

let looseGameImg = new Image();
looseGameImg.src = 'assets/loose-game.png';
let deadRabbitImg = new Image();
deadRabbitImg.src = 'assets/dead-rabbit.png';
let bgLooseGameImg = new Image();
bgLooseGameImg.src = 'assets/bg-loose-game.png';









/* GAME SOUNDS */
let audio = new Audio();

function playSound(sound) {
  audio.pause();
  audio.currentTime = 0;

  switch (sound) {
    case 'jump':
      audio.src = 'audio/jump.mp3';
      audio.play();
      break;
    case 'eat':
      audio.src = 'audio/eat.mp3';
      audio.play();
      break;
    case 'hole':
      audio.src = 'audio/hole.mp3';
      audio.play();
      break;
    case 'win':
      audio.src = 'audio/win-level.mp3';
      audio.play();
      break;
    case 'loose':
      audio.src = 'audio/loose.mp3';
      audio.play();
      break;
    case 'loose-life':
      audio.src = 'audio/loose-life.mp3';
      audio.play();
      break;
  }
}






/* PLAY GAME BUTTON */
let playGameBtn = document.getElementById("play-button");
playGameBtn.addEventListener("click", () => {
  gameState = 'RulesGame';
  playGameBtn.style.display = 'none';
})






/* GAME */
let GAMEWIDTH = 840;
let GAMEHEIGHT = 680;

let SQUARESIZE = 40;
let NB_ROWS = 17;
let NB_COLS = 21;

/* GameState */
let gameState = 'MainTitle';

/* function that changes the game state */
function changeGameState() {
  if (gameState === 'MainTitle' && enterPressed) {
    playGameBtn.style.display = 'none';
    gameState = 'RulesGame';
  } else if (gameState == 'RulesGame' && spacePressed) {
    gameState = 'LoadingLevel';
  }
}

/* no draw mode */
let noDrawMode = false;

/* currentLevels */
let currentLevelId = 1;
let currentLevel = JSON.parse(JSON.stringify(levels[currentLevelId - 1]));
let maxLevelCarrots = currentLevel.carrots.length;

let platformsTimeouts = [];

/* function that draws the game level */
function drawGameScreen() {
  drawGameBackground();

  drawGameCarrots();

  drawGameLadders();

  drawRabbit();

  drawFoxes();

  drawGamePlatforms();

  if (noDrawMode) {
    drawGameGrid();
  }
}

/* function that draws the game background */
function drawGameBackground() {
  if (noDrawMode) {

  } else {
    ctx.drawImage(bgGameImg, -2, -2, 1205, 683);
  }
}

/* function that draws the game carrots */
function drawGameCarrots() {
  currentLevel.carrots.forEach((carrot) => {
    let x = carrot.x;
    let y = carrot.y;
    if (noDrawMode) {
      ctx.beginPath();
      ctx.fillStyle = "#FFA555";
      ctx.fillRect(x * SQUARESIZE, y * SQUARESIZE, SQUARESIZE, SQUARESIZE);
      ctx.closePath();
    } else {
      ctx.drawImage(carrotImg, x * SQUARESIZE, y * SQUARESIZE);
    }
  });
}

/* function that draws the game ladders */
function drawGameLadders() {
  currentLevel.ladders.forEach((ladder) => {
    let x = ladder.x;
    let y = ladder.y;
    if (noDrawMode) {
      ctx.beginPath();
      ctx.fillStyle = "#FFFF55";
      ctx.fillRect(x * SQUARESIZE, y * SQUARESIZE, SQUARESIZE, SQUARESIZE);
      ctx.closePath();
    } else {
      ctx.drawImage(ladderImg, x * SQUARESIZE, y * SQUARESIZE);
    }
  });
}

/* function that draws the game platforms */
function drawGamePlatforms() {
  currentLevel.platforms.forEach((platform) => {
    let x = platform.x;
    let y = platform.y;
    if (noDrawMode) {
      ctx.beginPath();
      ctx.fillStyle = "#8B4513";
      ctx.fillRect(x * SQUARESIZE, y * SQUARESIZE, SQUARESIZE, SQUARESIZE);
      ctx.closePath();
    } else {
      let image = platform.image;
      if (image === "ground-2") {
        ctx.drawImage(ground2Img, x * SQUARESIZE, y * SQUARESIZE);
      } else {
        ctx.drawImage(ground1Img, x * SQUARESIZE, y * SQUARESIZE);
      }
    }
  });
}

/* BUTTONS */
let upPressed = false;
let downPressed = false;
let leftPressed = false;
let rightPressed = false;
let enterPressed = false;
let spacePressed = false;
let pPressed = false;

/* event listener that detects when a button is pressed */
document.addEventListener("keydown", () => {
  if (event.key == "Up" || event.key == "ArrowUp") {
    upPressed = true;
  } else if (event.key == "Down" || event.key == "ArrowDown") {
    downPressed = true;
  } else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = true;
  } else if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = true;
  } else if (event.key == "Enter") {
    enterPressed = true;
  } else if (event.key == " " || event.key == "Space") {
    spacePressed = true;
  } else if (event.key == "x" || event.key == "KeyX") {
    noDrawMode = !noDrawMode;
    if (playGameBtn.style.display === 'none' && gameState === 'MainTitle') {
      playGameBtn.style.display = 'inherit';
    } else {
      playGameBtn.style.display = 'none';
    }
  }
}, false);

/* event listener that detects when a button is released */
document.addEventListener("keyup", function() {
  if (event.key == "Up" || event.key == "ArrowUp") {
    upPressed = false;
  } else if (event.key == "Down" || event.key == "ArrowDown") {
    downPressed = false;
  } else if (event.key == "Left" || event.key == "ArrowLeft") {
    leftPressed = false;
  } else if (event.key == "Right" || event.key == "ArrowRight") {
    rightPressed = false;
  } else if (event.key == "Enter") {
    enterPressed = false;
  } else if (event.key == " " || event.key == "Space") {
    spacePressed = false;
  }
}, false);


/* SCREENS */
/* function that draws the main title screen */
function drawMainTitleScreen() {
  if (noDrawMode) {
    canvas.width = 1200;
    ctx.font = '80px Courier New';
    ctx.fillStyle = "black";
    ctx.textAlign = 'Center';
    let text = `Carrot Mania`;
    let measure = ctx.measureText(text);
    ctx.fillText(text, W / 2 - measure.width / 2, H / 2);

    ctx.font = '35px Courier New';
    ctx.fillStyle = "black";
    ctx.textAlign = 'Center';
    let text2 = `Press Enter to start`;
    let measure2 = ctx.measureText(text2);
    ctx.fillText(text2, W / 2 - measure2.width / 2, H / 2 + 70);
  } else {
    canvas.width = 938;
    ctx.drawImage(mainTitleImg, -3, -1, 945, 681);
  }
}

/* function that draw the game rules */
function drawRulesGameScreen() {
  canvas.width = 1200;
  if (noDrawMode) {

  } else {
    ctx.drawImage(rulesGameImg, 0, 0, 1200, 680);
  }
}

/* function that draws the loading level screen */
function drawLoadingLevelScreen() {
  canvas.width = 1200;
  if (noDrawMode) {
    ctx.font = '48px Courier New';
    ctx.fillStyle = "black";
    ctx.textAlign = 'Center';
    let text = `LoadingLevel : ${currentLevelId}`;
    let measure = ctx.measureText(text);
    ctx.fillText(text, W / 2 - measure.width / 2, H / 2);
  } else {
    ctx.drawImage(loadingImg, 0, 0, W, H);
    ctx.font = '30px bloomer';
    ctx.fillStyle = "white";
    ctx.textAlign = 'Center';
    let text2 = `Chargement...`;
    let measure2 = ctx.measureText(text2);
    ctx.fillText(text2, W / 2 - measure2.width / 2 - 200, H / 2);
  }
}

/* function that draws the game over screen */
function drawWinGameScreen() {
  canvas.width = 1200;
  if (noDrawMode) {
    ctx.font = '48px Courier New';
    ctx.fillStyle = "black";
    ctx.textAlign = 'Center';
    let text = `You Win !!!`;
    let measure = ctx.measureText(text);
    ctx.fillText(text, W / 2 - measure.width / 2, H / 2);
  } else {
    ctx.drawImage(bgWinGameImg, 0, 0);
    for (var i = 0; i < clouds.length; i++) {
      ctx.drawImage(cloudImg, clouds[i].x, clouds[i].y, clouds[i].w, clouds[i].h);
    }
    ctx.drawImage(winGameImg, 0, 0, W, H);
  }
}

/* function that draws the loose game screen */
function drawLooseGameScreen() {
  canvas.width = 1200;
  if (noDrawMode) {
    ctx.font = '48px Courier New';
    ctx.fillStyle = "black";
    ctx.textAlign = 'Center';
    let text = `You Loose !!!`;
    let measure = ctx.measureText(text);
    ctx.fillText(text, W / 2 - measure.width / 2, H / 2);
  } else {
    ctx.drawImage(bgLooseGameImg, 0, 0);
    for (var i = 0; i < deadRabbits.length; i++) {
      ctx.drawImage(deadRabbitImg, deadRabbits[i].x, deadRabbits[i].y, deadRabbits[i].l, deadRabbits[i].l);
    }
    ctx.drawImage(looseGameImg, 0, 0, W, H);
  }
}

/* function that draws the game infos */
function drawGameInfos() {
  if (noDrawMode) {
    ctx.font = '15px Courier New';
    ctx.fillStyle = "black";
    let textLevel = `Level : ${currentLevelId}`;
    let textCarrots = `Carrots : ${rabbitCarrots} / ${maxLevelCarrots}`;
    let textLives = `Lives : ${rabbitLives} / 3`;
    ctx.fillText(textLevel, 900, 100);
    ctx.fillText(textCarrots, 900, 200);
    ctx.fillText(textLives, 900, 300);
  } else {
    ctx.font = '30px Arial';
    ctx.fillStyle = "#f8e01c";
    let textLevel = `${currentLevelId} / ${levels.length}`;
    let textCarrots = `${rabbitCarrots} / ${maxLevelCarrots}`;
    let textLives = `${rabbitLives} / 3`;
    ctx.fillText(textLevel, 1100, 230);
    ctx.fillText(textCarrots, 1100, 347);
    ctx.fillText(textLives, 1100, 480);
  }
}

/*  function that draws the game grid */
function drawGameGrid() {
  for (let i = 0; i < GAMEWIDTH; i += SQUARESIZE) {
    for (let j = 0; j < GAMEHEIGHT; j += SQUARESIZE) {
      ctx.strokeStyle = "#AAA";
      ctx.strokeRect(i, j, SQUARESIZE, SQUARESIZE);
    }
  }
}

/* function that change the level variables */
function changeLevel() {
  playSound('win');
  clearPlatformsTimeouts();
  if (levels[currentLevelId] === undefined) {
    gameState = 'WinGame';
  } else {
    currentLevelId++;
    currentLevel = JSON.parse(JSON.stringify(levels[currentLevelId - 1]));
    maxLevelCarrots = currentLevel.carrots.length;

    rabbitLives = 3;
    rabbitCarrots = 0;
    rabbitX = currentLevel.rabbit.x;
    rabbitY = currentLevel.rabbit.y;
    rabbitVX = 0;
    rabbitVY = 0;
    rabbitDirection = 'right';
    rabbitSprite.image = rabbitWalkRight;
    rabbitSprite.width = 200;
    rabbitSprite.height = 40;
    rabbitSprite.ticksPerFrame = 4;
    rabbitSprite.numberOfFrames = 5;

    initialiseFoxes();

    gameState = 'LoadingLevel';
  }
}

/* function that reset the level's platforms */
function resetPlatforms() {
  currentLevel.platforms = [];
  currentLevel.platforms = JSON.parse(JSON.stringify(levels[currentLevelId - 1].platforms));
}

/* function that makes the restart of the level */
function restartLevel() {
  rabbitLives--;

  initialiseFoxes();

  clearPlatformsTimeouts();

  resetPlatforms();

  if (rabbitLives === 0) {
    playSound('loose');
    gameState = 'LooseGame';
  } else {
    rabbitDirection = 'right';
    rabbitX = currentLevel.rabbit.x;
    rabbitY = currentLevel.rabbit.y;
    rabbitSprite.image = rabbitWalkRight;
    rabbitSprite.width = 200;
    rabbitSprite.height = 40;
    rabbitSprite.ticksPerFrame = 4;
    rabbitSprite.numberOfFrames = 5;
  }
}

/* function that clears the platforms timeouts */
function clearPlatformsTimeouts() {
  for (let i = 0; i < platformsTimeouts.length; i++) {
    clearTimeout(platformsTimeouts[i]);
  }
}









/* RABBIT*/
let rabbitX = currentLevel.rabbit.x;
let rabbitY = currentLevel.rabbit.y;
let rabbitVX = 0;
let rabbitVY = 0;

let rabbitDirection = 'right'; // 'up', 'down', 'left' or 'right'

let rabbitCanMove = true;
let rabbitIsMoving = false;
let rabbitLives = 3;
let rabbitCarrots = 0;

let rabbitSprite = new Sprite(rabbitWalkRight, 200, 40, 4, 5);

/* function that draws the rabbit */
function drawRabbit() {
  switch (rabbitDirection) {
    case 'left':
      if (noDrawMode) {
        ctx.drawImage(rabbitLeft, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
      } else {
        if (!rabbitIsMoving) {
          ctx.drawImage(rabbitLeft2, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        } else {
          rabbitSprite.render(rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        }
      }
      break;
    case 'right':
      if (noDrawMode) {
        ctx.drawImage(rabbitRight, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
      } else {
        if (!rabbitIsMoving) {
          ctx.drawImage(rabbitRight2, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        } else {
          rabbitSprite.render(rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        }
      }
      break;
    case 'up':
      if (noDrawMode) {
        ctx.drawImage(rabbitUp, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
      } else {
        if (!rabbitIsMoving) {
          ctx.drawImage(rabbitUp2, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        } else {
          rabbitSprite.render(rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        }
      }
      break;
    case 'down':
      if (noDrawMode) {
        ctx.drawImage(rabbitDown, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
      } else {
        if (!rabbitIsMoving) {
          ctx.drawImage(rabbitDown2, rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        } else {
          rabbitSprite.render(rabbitX * SQUARESIZE, rabbitY * SQUARESIZE);
        }
      }
      break;
  }
}

/* function that makes move the rabbit */
function moveRabbit() {
  if (!rabbitCanFall()) {
    if (leftPressed && rabbitCanMove && rabbitX > 0 && !thereIsAPlatform(rabbitX - 1, rabbitY)) {
      rabbitSprite.frameIndex = 0;
      if (rabbitDirection === 'left') {
        playSound('jump');
        rabbitSprite.ticksPerFrame = 4;
        rabbitCanMove = false;
        rabbitIsMoving = true;
        rabbitVX = -0.05;
        reCanMoveRabbit();
      } else {
        rabbitDirection = 'left';
        rabbitSprite.image = rabbitWalkLeft;
        rabbitSprite.width = 200;
        rabbitSprite.height = 40;
        rabbitSprite.ticksPerFrame = 4;
        rabbitSprite.numberOfFrames = 5;
        rabbitCanMove = false;
        reCanMoveRabbit();
      }
    } else if (rightPressed && rabbitCanMove && rabbitX + 1 < NB_COLS && !thereIsAPlatform(rabbitX + 1, rabbitY)) {
      rabbitSprite.frameIndex = 0;
      if (rabbitDirection === 'right') {
        playSound('jump');
        rabbitSprite.ticksPerFrame = 4;
        rabbitCanMove = false;
        rabbitIsMoving = true;
        rabbitVX = 0.05;
        reCanMoveRabbit();
      } else {
        rabbitDirection = 'right';
        rabbitSprite.image = rabbitWalkRight;
        rabbitSprite.width = 200;
        rabbitSprite.height = 40;
        rabbitSprite.ticksPerFrame = 4;
        rabbitSprite.numberOfFrames = 5;
        rabbitCanMove = false;
        reCanMoveRabbit();
      }
    } else if (upPressed && rabbitCanMove && rabbitY - 1 >= 0 && thereIsALadder(rabbitX, rabbitY) && !thereIsAPlatform(rabbitX, rabbitY - 1)) {
      rabbitSprite.frameIndex = 0;
      if (rabbitDirection === 'up') {
        rabbitSprite.ticksPerFrame = 4;
        rabbitCanMove = false;
        rabbitIsMoving = true;
        rabbitVY = -0.05;
        reCanMoveRabbit();
      } else {
        rabbitDirection = 'up';
        rabbitSprite.image = rabbitClimbUp;
        rabbitSprite.width = 80;
        rabbitSprite.height = 40;
        rabbitSprite.ticksPerFrame = 4;
        rabbitSprite.numberOfFrames = 2;
        rabbitCanMove = false;
        reCanMoveRabbit();
      }
    } else if (downPressed && rabbitCanMove && rabbitY + 1 < NB_ROWS && !thereIsAPlatform(rabbitX, rabbitY + 1)) {
      rabbitSprite.frameIndex = 0;
      if (rabbitDirection === 'down') {
        rabbitSprite.ticksPerFrame = 4;
        rabbitCanMove = false;
        rabbitIsMoving = true;
        rabbitVY = 0.05;
        reCanMoveRabbit();
      } else {
        rabbitDirection = 'down';
        rabbitSprite.image = rabbitClimbDown;
        rabbitSprite.width = 80;
        rabbitSprite.height = 40;
        rabbitSprite.ticksPerFrame = 4;
        rabbitSprite.numberOfFrames = 2;
        rabbitCanMove = false;
        reCanMoveRabbit();
      }
    } else if (spacePressed && rabbitCanMove && (rabbitDirection === 'left' || rabbitDirection === 'right')) {
      playSound('hole');
      rabbitSprite.frameIndex = 0;
      rabbitCanMove = false;
      rabbitIsMoving = true;
      rabbitSprite.ticksPerFrame = 0;
      rabbitSprite.numberOfFrames = 5;
      rabbitDigsAHole(rabbitDirection);
    }
  }
  rabbitSprite.update();
  changePosRabbit();
}

/* function that detects the collision between the rabbit and the foxes */
function detectEnemiesCollision() {
  let currentFox;
  for (let i = 0; i < foxes.length; i++) {
    currentFox = foxes[i];
    if ((rabbitX + 1 > currentFox.foxX && rabbitX + 1 < currentFox.foxX + 1 && rabbitY === currentFox.foxY) || (rabbitX < currentFox.foxX + 1 && rabbitX > currentFox.foxX && rabbitY === currentFox.foxY)) {
      playSound('loose-life');
      restartLevel();
    }
  }
}

/* function that re authorizes the player to making move the rabbit with the arrow keys */
function reCanMoveRabbit() {
  let timeOut = window.setTimeout(() => {
    rabbitVX = 0;
    rabbitVY = 0;
    rabbitCanMove = true;
    rabbitIsMoving = false;
    rabbitX = Math.round(rabbitX);
    rabbitY = Math.round(rabbitY);
  }, 300);
}

/* function that makes fall the rabbit */
function rabbitCanFall() {
  let noPlatformUnderRabbit = !thereIsAPlatform(rabbitX, rabbitY + 1);
  let noLadderUnderRabbit = !thereIsALadder(rabbitX, rabbitY + 1);
  let noLadderBehindRabbit = !thereIsALadder(rabbitX, rabbitY);
  let noFoxUnderRabbit = !thereIsAFox(rabbitX, rabbitY + 1);
  if (rabbitCanMove && noPlatformUnderRabbit && noLadderUnderRabbit && noLadderBehindRabbit && noFoxUnderRabbit && rabbitY + 1 < NB_ROWS) {
    rabbitVY = 0.5;
    return true;
  } else if (rabbitCanMove && (!noPlatformUnderRabbit || !noLadderUnderRabbit || !noFoxUnderRabbit || rabbitY + 1 >= NB_ROWS)) {
    rabbitVY = 0;
    return false;
  }
}

/* function that changes the position of the rabbit */
function changePosRabbit() {
  rabbitX += rabbitVX;
  rabbitY += rabbitVY;
}

/* function that returns true if there is a platform, false if not */
function thereIsAPlatform(x, y) {
  for (let i = 0; i < currentLevel.platforms.length; i++) {
    if (currentLevel.platforms[i].x === x && currentLevel.platforms[i].y === y) {
      return true;
    }
  }
  return false;
}

/* function that returns true if there is a ladder, false if not */
function thereIsALadder(x, y) {
  for (let i = 0; i < currentLevel.ladders.length; i++) {
    if (currentLevel.ladders[i].x === x && currentLevel.ladders[i].y === y) {
      return true;
    }
  }
  return false;
}

/* function that returns true if there is a rabbit, false if not */
function thereIsAFox(x, y) {
  for (let i = 0; i < foxes.length; i++) {
    if (foxes[i].foxX === x && foxes[i].foxY === y) {
      return true;
    }
  }
  return false;
}

/* function that making the rabbit eat the carrot */
function rabbitEatCarrot() {
  for (let i = 0; i < currentLevel.carrots.length; i++) {
    if (currentLevel.carrots[i].x === rabbitX && currentLevel.carrots[i].y === rabbitY) {
      rabbitCarrots++;
      let pos = currentLevel.carrots.findIndex((element) => {
        return element.x === rabbitX && element.y === rabbitY;
      });
      currentLevel.carrots.splice(pos, 1);
      playSound('eat');
    }
    if (currentLevel.carrots.length === 0) {
      changeLevel();
    }
  }
}

/* function that making the rabbit digs a hole on the ground */
function rabbitDigsAHole(rabbitDirection) {
  if (rabbitDirection === 'left' && thereIsAPlatform(rabbitX - 1, rabbitY + 1) && !thereIsAPlatform(rabbitX - 1, rabbitY)) {

    let pos = currentLevel.platforms.findIndex((element) => {
      return element.x === rabbitX - 1 && element.y === rabbitY + 1;
    });

    let platform = currentLevel.platforms[pos];
    currentLevel.platforms.splice(pos, 1);

    platformsTimeouts.push(setTimeout(function() {
      currentLevel.platforms.push(platform);
      if (platform.x === rabbitX && platform.y === rabbitY) {
        restartLevel();
      }
    }, 7000));
  } else if (rabbitDirection === 'right' && thereIsAPlatform(rabbitX + 1, rabbitY + 1) && !thereIsAPlatform(rabbitX + 1, rabbitY)) {

    let pos = currentLevel.platforms.findIndex((element) => {
      return element.x === rabbitX + 1 && element.y === rabbitY + 1;
    });

    let platform = currentLevel.platforms[pos];
    currentLevel.platforms.splice(pos, 1);

    platformsTimeouts.push(setTimeout(function() {
      currentLevel.platforms.push(platform);
      if (platform.x === rabbitX && platform.y === rabbitY) {
        restartLevel();
      }
    }, 7000));
  }
  reCanMoveRabbit();
}









/* FOXES */
/* FOXES CLASS */
class Foxes {
  constructor(foxX, foxY, foxDirection) {
    this.foxX = foxX;
    this.foxY = foxY;
    this.foxVX = 0;
    this.foxVY = 0;

    this.foxDirection = foxDirection;

    this.foxCanMove = true;
    if (foxDirection === 'left') {
      this.foxSprite = new Sprite(foxWalkLeft, 160, 40, 4, 4);
    } else if (foxDirection === 'right') {
      this.foxSprite = new Sprite(foxWalkRight, 160, 40, 4, 4);
    }
  }

  /* method that draw fox on the game */
  drawFox() {
    if (noDrawMode) {
      ctx.beginPath();
      ctx.fillStyle = "#FFA500";
      ctx.fillRect(this.foxX * SQUARESIZE, this.foxY * SQUARESIZE, SQUARESIZE, SQUARESIZE);
      ctx.closePath();
    } else {
      this.foxSprite.render(this.foxX * SQUARESIZE, this.foxY * SQUARESIZE);
    }
  }

  /* method that makes move the fox */
  moveFox() {
    if (!this.foxCanFall()) {
      if (this.foxY === NB_ROWS - 1) {
        if (this.foxDirection === 'right' && !thereIsAPlatform(this.foxX + 1, this.foxY) && this.foxX < NB_COLS - 1 && this.foxCanMove) {
          this.foxCanMove = false;
          this.foxVX = 0.04;
          this.reCanMoveFox();
        } else if (this.foxDirection === 'left' && !thereIsAPlatform(this.foxX - 1, this.foxY) && this.foxX > 0 && this.foxCanMove) {
          this.foxCanMove = false;
          this.foxVX = -0.04;
          this.reCanMoveFox();
        } else if (thereIsAPlatform(this.foxX - 1, this.foxY) && thereIsAPlatform(this.foxX + 1, this.foxY)) {

        } else {
          this.changeFoxDirection();
        }
      } else {
        if (this.foxDirection === 'right' && !this.thereIsAPlatform(this.foxX + 1, this.foxY) && this.foxX < NB_COLS - 1 && this.foxCanMove && (this.thereIsAPlatform(this.foxX + 1, this.foxY + 1) || this.thereIsALadder(this.foxX + 1, this.foxY + 1))) {
          this.foxCanMove = false;
          this.foxVX = 0.04;
          this.reCanMoveFox();
        } else if (this.foxDirection === 'left' && !this.thereIsAPlatform(this.foxX - 1, this.foxY) && this.foxX > 0 && this.foxCanMove && (this.thereIsAPlatform(this.foxX - 1, this.foxY + 1) || this.thereIsALadder(this.foxX - 1, this.foxY + 1))) {
          this.foxCanMove = false;
          this.foxVX = -0.04;
          this.reCanMoveFox();
        } else if (thereIsAPlatform(this.foxX - 1, this.foxY) && thereIsAPlatform(this.foxX + 1, this.foxY)) {

        } else {
          this.changeFoxDirection();
        }
      }
    }
    this.foxSprite.update();
    this.changePosFox();
  }


  /* method that re authorizes the fox to move */
  reCanMoveFox() {
    let timeOut = window.setTimeout(() => {
      this.foxVX = 0;
      this.foxVY = 0;
      this.foxCanMove = true;
      this.foxX = Math.round(this.foxX);
      this.foxY = Math.round(this.foxY);
    }, 400);
  }

  /* function that changes the position of the fox */
  changePosFox() {
    this.foxX += this.foxVX;
    this.foxY += this.foxVY;
  }

  /* function that changes the direction of the fox */
  changeFoxDirection() {
    if (this.foxCanMove) {
      if (this.foxDirection === 'right') {
        this.foxSprite.image = foxWalkLeft;
        this.foxDirection = 'left';
      } else if (this.foxDirection === 'left') {
        this.foxSprite.image = foxWalkRight;
        this.foxDirection = 'right';
      }
    }
  }

  /* method that checks if there is a platform in the levels.js file */
  thereIsAPlatform(x, y) {
    for (let i = 0; i < levels[currentLevelId - 1].platforms.length; i++) {
      if (levels[currentLevelId - 1].platforms[i].x === x && levels[currentLevelId - 1].platforms[i].y === y) {
        return true;
      }
    }
    return false;
  }

  /* method that checks if there is a ladder in the levels.js file */
  thereIsALadder(x, y) {
    for (let i = 0; i < levels[currentLevelId - 1].ladders.length; i++) {
      if (levels[currentLevelId - 1].ladders[i].x === x && levels[currentLevelId - 1].ladders[i].y === y) {
        return true;
      }
    }
    return false;
  }

  /* method that makes fall the rabbit */
  foxCanFall() {
    let noPlatformUnderFox = !thereIsAPlatform(this.foxX, this.foxY + 1);
    let noLadderUnderFox = !thereIsALadder(this.foxX, this.foxY + 1);
    let noLadderBehindFox = !thereIsALadder(this.foxX, this.foxY);
    let noRabbitUnderFox = !thereIsARabbit(this.foxX, this.foxY + 1);
    let noFoxUnderFox = !thereIsAFox(this.foxX, this.foxY + 1);

    if (this.foxCanMove && noPlatformUnderFox && noLadderUnderFox && noLadderBehindFox && noRabbitUnderFox && noFoxUnderFox && this.foxY + 1 < NB_ROWS) {
      this.foxVY = 0.5;
      return true;
    } else if (this.foxCanMove && (!noPlatformUnderFox || !noLadderUnderFox || !noRabbitUnderFox || !noFoxUnderFox || this.foxY + 1 >= NB_ROWS)) {
      this.foxVY = 0;
      return false;
    }
  }
}

let foxes;
initialiseFoxes();

/* function that initialises the foxes array */
function initialiseFoxes() {
  foxes = [];
  let currentFox;
  for (var i = 0; i < currentLevel.foxes.length; i++) {
    currentFox = currentLevel.foxes[i];
    let fox = new Foxes(currentFox.x, currentFox.y, currentFox.direction);
    foxes.push(fox);
  }
}

/* function that returns true if there is a rabbit, false if not */
function thereIsARabbit(x, y) {
  if (rabbitX === x && rabbitY === y) {
    return true;
  }
  return false;
}

/* function that draws the foxes on the game */
function drawFoxes() {
  for (var i = 0; i < foxes.length; i++) {
    foxes[i].drawFox();
  }
}

/* function that makes moves the foxes */
function moveFoxes() {
  for (var i = 0; i < foxes.length; i++) {
    foxes[i].moveFox();
  }
}









/* LOOSE GAME SCREEN */
let deadRabbits = [];
initLooseGameScreen();

function initLooseGameScreen() {
  let deadRabbit = {
    x: 1100,
    y: 400,
    l: 200,
  }
  deadRabbits.push(deadRabbit);

  deadRabbit = {
    x: 24,
    y: 400,
    l: 70,
  }
  deadRabbits.push(deadRabbit);

  deadRabbit = {
    x: 1000,
    y: 30,
    l: 130,
  }
  deadRabbits.push(deadRabbit);

  deadRabbit = {
    x: 170,
    y: 50,
    l: 30,
  }
  deadRabbits.push(deadRabbit);

  deadRabbit = {
    x: 100,
    y: 30,
    l: 300,
  }
  deadRabbits.push(deadRabbit);
}

function updateLooseGameScreen() {
  for (var i = 0; i < deadRabbits.length; i++) {
    if (deadRabbits[i].l < 100) {
      deadRabbits[i].y += 2;
    } else if (deadRabbits[i].l < 200) {
      deadRabbits[i].y += 4;
    } else {
      deadRabbits[i].y += 8;
    }
    if (deadRabbits[i].y > H) {
      deadRabbits[i].y = 0;
    }
  }
}









/* WIN GAME SCREEN */
let clouds = [];
initWinGameScreen();

function initWinGameScreen() {
  let cloud = {
    x: 1000,
    y: 70,
    w: 300,
    h: 300
  }
  clouds.push(cloud);

  cloud = {
    x: 240,
    y: 70,
    w: 100,
    h: 100
  }
  clouds.push(cloud);

  cloud = {
    x: 800,
    y: 30,
    w: 130,
    h: 130
  }
  clouds.push(cloud);
}

function updateWinGameScreen() {
  clouds[0].x -= 0.2;
  clouds[1].x -= 0.05;
  clouds[2].x -= 0.1;
}









/* INIT, UPDATE AND ANIMATE */
/* function that initialises the game */
function init() {
  drawMainTitleScreen();
}

/* function that updates the game */
function update() {
  changeGameState();

  if (gameState === 'MainTitle') {
    drawMainTitleScreen();
  } else if (gameState === 'RulesGame') {
    drawRulesGameScreen();
  } else if (gameState === 'LoadingLevel') {
    drawLoadingLevelScreen();
    let timeOut = window.setTimeout(() => {
      gameState = 'Game';
    }, 1500);
  } else if (gameState === 'Game') {
    rabbitEatCarrot();
    detectEnemiesCollision();
    moveRabbit();
    moveFoxes();
    drawGameScreen();
    drawGameInfos();
  } else if (gameState === 'WinGame') {
    updateWinGameScreen();
    drawWinGameScreen();
  } else if (gameState === 'LooseGame') {
    updateLooseGameScreen();
    drawLooseGameScreen();
  }
}

/* function that animate the game */
function animate() {
  ctx.clearRect(0, 0, W, H);
  update();
  requestAnimationFrame(animate);
}









/* LAUNCH THE GAME */
init();
animate();