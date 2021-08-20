import Bar from './Bar.js';
import Ball from './Ball.js';
import GameState from './GameState.js';
import Rect from './Rect.js';

const update = (canvas, context, entities) => {
  requestAnimationFrame(() => update(canvas, context, entities));
  context.clearRect(0, 0, canvas.width, canvas.height);
  entities.forEach((e) => e.update(context));
};

const main = () => {
  const canvas = document.getElementsByTagName('canvas')[0];
  const canvasRect = new Rect(0, 0, canvas.width, canvas.height);
  const context = canvas.getContext('2d');

  const gameState = new GameState();
  const leftBarRect = new Rect(20, 50, 20, 50);
  const leftBar = new Bar(
    leftBarRect,
    '#FFFFFF',
    'q',
    'a',
    canvas.height,
    () => {
      gameState.leftPlaying();
      if (gameState.arePlayersReady()) ball.startGame();
    },
  );
  const rightBarRect = new Rect(560, 100, 20, 50);
  const rightBar = new Bar(
    rightBarRect,
    '#FFFFFF',
    'o',
    'l',
    canvas.height,
    () => {
      gameState.rightPlaying();
      if (gameState.arePlayersReady()) ball.startGame();
    },
  );
  const ball = new Ball(
    canvas.width / 2,
    canvas.height / 2,
    20,
    '#FFFFFF',
    leftBarRect,
    rightBarRect,
    canvasRect,
    (side) => {
      if (side === 'left') gameState.rightScored();
      else gameState.leftScored();
    },
  );

  const entities = [leftBar, rightBar, ball];
  update(canvas, context, entities);
};

main();
