import SierpinskiTriangle from './SierpinskiTriangle.js';

const canvas = document.getElementsByTagName('canvas')[0];
const context = canvas.getContext('2d');

const marginAroundCanvas = 40;
const triangleHeight = canvas.height - 2 * marginAroundCanvas;
const triangleSide = (2 * triangleHeight) / Math.sqrt(3);
const trianglePoints = [
  {
    x: canvas.width / 2,
    y: marginAroundCanvas,
  },
  {
    x: (canvas.width - triangleSide) / 2,
    y: canvas.height - marginAroundCanvas,
  },
  {
    x: (canvas.width + triangleSide) / 2,
    y: canvas.height - marginAroundCanvas,
  },
];

const triangle = new SierpinskiTriangle(context, trianglePoints);

const slider = document.getElementById('slider');
slider.addEventListener('input', (e) => {
  const label = document.getElementById('sliderLabel');
  label.textContent = `Subdivisiones: ${e.target.value}`;

  context.clearRect(0, 0, canvas.width, canvas.height);
  triangle.render(e.target.value);
});
