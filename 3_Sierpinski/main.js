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

let sliderValue = 0;
let onlyLines = true;

const renderCanvas = () => {
  context.clearRect(0, 0, canvas.width, canvas.height);
  triangle.render(sliderValue, onlyLines);
};

const slider = document.getElementById('slider');
slider.addEventListener('input', (e) => {
  const label = document.getElementById('sliderLabel');
  label.textContent = `Subdivisiones: ${e.target.value}`;

  sliderValue = e.target.value;
  renderCanvas();
});

const checkbox = document.getElementById('onlyLines');
checkbox.addEventListener('input', (e) => {
  onlyLines = e.target.checked;
  renderCanvas();
});
