import Rect from './Rect.js';

export default class Ball {
  /**
   * @param {number} x
   * @param {number} y
   * @param {number} r
   * @param {string} color
   * @param {Rect} leftBarRect
   * @param {Rect} rightBarRect
   * @param {Rect} canvasRect
   * @param {(string) => void} outOfBounds
   */
  constructor(
    x,
    y,
    r,
    color,
    leftBarRect,
    rightBarRect,
    canvasRect,
    outOfBounds,
  ) {
    this.originalX = x;
    this.originalY = y;
    this.r = r;
    this.color = color;
    this.leftBarRect = leftBarRect;
    this.rightBarRect = rightBarRect;
    this.canvasRect = canvasRect;
    this.outOfBounds = outOfBounds;

    this.reset();
  }

  reset() {
    this.playing = false;

    this.x = this.originalX;
    this.y = this.originalY;

    const goesLeft = Math.random() > 0.5 ? 1 : -1;
    this.playing = false;
    this.velX = goesLeft * 3;
    this.velY = Math.random() * 4 - 2;
  }

  startGame() {
    this.playing = true;
  }

  /**
   * @param {CanvasRenderingContext2D} context
   */
  render(context) {
    context.fillStyle = this.color;
    context.beginPath();
    context.arc(this.x, this.y, this.r, 0, Math.PI * 2);
    context.fill();
  }

  hitsLeftBar() {
    // Check that the ball is going left
    if (this.velX > 0) return false;
    // Check ball is left enough to hit the bar, but not enough to have passed it
    if (this.x - this.r > this.leftBarRect.x + this.leftBarRect.w) return false;
    if (this.x < this.leftBarRect.x + this.leftBarRect.w) return false;
    // Check bar is next to ball
    return (
      this.y > this.leftBarRect.y &&
      this.y < this.leftBarRect.y + this.leftBarRect.h
    );
  }

  hitsRightBar() {
    // Check that the ball is going right
    if (this.velX < 0) return false;
    // Check ball is right enough to hit the bar, but not enough to have passed it
    if (this.x + this.r < this.rightBarRect.x) return false;
    if (this.x > this.rightBarRect.x) return false;
    // Check bar is next to ball
    return (
      this.y > this.rightBarRect.y &&
      this.y < this.rightBarRect.y + this.rightBarRect.h
    );
  }

  /**
   * @param {CanvasRenderingContext2D} context
   */
  update(context) {
    if (this.playing) {
      this.x += this.velX;
      this.y += this.velY;
      if (this.hitsLeftBar()) {
        this.velX *= -1;
      } else if (this.x < -this.r) {
        this.reset();
        this.outOfBounds('left');
        return;
      }
      if (this.hitsRightBar()) {
        this.velX *= -1;
      } else if (this.x - this.r > this.canvasRect.w) {
        this.reset();
        this.outOfBounds('right');
        return;
      }
      if (this.y < this.r || this.y + this.r > this.canvasRect.h)
        this.velY *= -1;
    }
    this.render(context);
  }
}
