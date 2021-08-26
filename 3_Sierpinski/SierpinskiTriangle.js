export default class SierpinskiTriangle {
  /**
   * @param {CanvasRenderingContext2D} context
   * @param {{x: number, y: number}[]} startingPoints
   */
  constructor(context, startingPoints) {
    this.context = context;
    this.startingPoints = startingPoints;
    this.render(0, true);
  }

  /**
   * @param {number} subdivisions
   * @param {boolean} onlyLines
   */
  render(subdivisions, onlyLines) {
    this.context.fillStyle = '#0d65b8';
    this.context.strokeStyle = '#0d65b8';
    this.renderTriangleFromPoints(this.startingPoints, onlyLines);

    this.context.fillStyle = '#ffffff';
    this.renderSubdivisions(subdivisions, this.startingPoints, onlyLines);
  }

  /**
   * @param {{x: number, y: number}[]} points
   * @param {boolean} onlyLines
   */
  renderTriangleFromPoints(points, onlyLines) {
    this.context.beginPath();
    this.context.moveTo(points[0].x, points[0].y);
    this.context.lineTo(points[1].x, points[1].y);
    this.context.lineTo(points[2].x, points[2].y);
    this.context.closePath();
    if (onlyLines) {
      this.context.stroke();
    } else {
      this.context.fill();
    }
  }

  /**
   * @param {number} subdivisions
   * @param {{x: number, y: number}[]} points
   * @param {boolean} onlyLines
   */
  renderSubdivisions(subdivisions, points, onlyLines) {
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

    this.renderTriangleFromPoints(midwayPoints, onlyLines);

    subdivisions--;
    this.renderSubdivisions(
      subdivisions,
      [points[0], midwayPoints[0], midwayPoints[2]],
      onlyLines,
    );
    this.renderSubdivisions(
      subdivisions,
      [points[1], midwayPoints[0], midwayPoints[1]],
      onlyLines,
    );
    this.renderSubdivisions(
      subdivisions,
      [points[2], midwayPoints[1], midwayPoints[2]],
      onlyLines,
    );
  }
}
