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

const slider = document.getElementById('slider');
slider.addEventListener('input', (e) => {
  // Update label
  const label = document.getElementById('sliderLabel');
  label.textContent = `Subdivisiones: ${e.target.value}`;

  // Update triangle
  drawSierpinskiTriangle(e.target.value);
});

const renderTriangleFromPoints = (points) => {
  context.beginPath();
  context.moveTo(points[0].x, points[0].y);
  context.lineTo(points[1].x, points[1].y);
  context.lineTo(points[2].x, points[2].y);
  context.closePath();
  context.fill();
};

const renderSubdivisions = (subdivisions, points) => {
  if (subdivisions <= 0) return;

  const midwayPoints = [
    {
      x: (points[0].x + points[1].x) / 2,
      y: (points[0].y + points[1].y) / 2,
    },
    {
      x: (points[1].x + points[2].x) / 2,
      y: (points[1].y + points[2].y) / 2,
    },
    {
      x: (points[2].x + points[0].x) / 2,
      y: (points[2].y + points[0].y) / 2,
    },
  ];

  renderTriangleFromPoints(midwayPoints);

  subdivisions--;
  renderSubdivisions(subdivisions, [
    points[0],
    midwayPoints[0],
    midwayPoints[2],
  ]);
  renderSubdivisions(subdivisions, [
    points[1],
    midwayPoints[0],
    midwayPoints[1],
  ]);
  renderSubdivisions(subdivisions, [
    points[2],
    midwayPoints[1],
    midwayPoints[2],
  ]);
};

const drawSierpinskiTriangle = (subdivisions) => {
  context.clearRect(0, 0, canvas.width, canvas.height);

  context.fillStyle = '#0d65b8';
  renderTriangleFromPoints(trianglePoints);

  context.fillStyle = '#ffffff';
  renderSubdivisions(subdivisions, trianglePoints);
};

drawSierpinskiTriangle(0);
