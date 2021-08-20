const drawRect = (ctx, color, x, y, width, height) => {};
const main = () => {
  const canvas = document.getElementsByTagName('canvas')[0];
  const width = 700;
  const height = 600;
  console.log(canvas);
  const context = canvas.getContext('2d');
  const squareSize = 100;
  const squareX = (width - squareSize) / 2;
  const squareY = (height - squareSize) / 2;
  context.fillStyle = 'rgba(0,0,200,1)';
  context.fillRect(squareX, squareY, squareSize, squareSize);
  context.fillStyle = 'rgba(0,200,0,0.5)';
  context.fillRect(squareX + 30, squareY + 30, squareSize, squareSize);
};

main();
