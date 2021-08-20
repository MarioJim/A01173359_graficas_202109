import Rect from './Rect.js';

export default class Bar {
  /**
   * @param {Rect} rect
   * @param {string} color
   * @param {string} upKey
   * @param {string} downKey
   * @param {number} canvasHeight
   * @param {() => void} onMove
   */
  constructor(rect, color, upKey, downKey, canvasHeight, onMove) {
    this.rect = rect;
    this.color = color;
    this.upKey = upKey;
    this.downKey = downKey;
    this.canvasHeight = canvasHeight;
    this.setupKeyboardEventListeners();
    this.up = false;
    this.down = false;
    this.onMove = onMove;
  }

  /**
   * @param {CanvasRenderingContext2D} context
   */
  render(context) {
    context.fillStyle = this.color;
    context.fillRect(this.rect.x, this.rect.y, this.rect.w, this.rect.h);
  }

  setupKeyboardEventListeners() {
    document.addEventListener('keydown', (event) => {
      switch (event.key) {
        case this.upKey:
          this.up = true;
          this.onMove();
          break;
        case this.downKey:
          this.down = true;
          this.onMove();
          break;
      }
    });

    document.addEventListener('keyup', (event) => {
      switch (event.key) {
        case this.upKey:
          this.up = false;
          break;
        case this.downKey:
          this.down = false;
          break;
      }
    });
  }

  /**
   * @param {CanvasRenderingContext2D} context
   */
  update(context) {
    if (this.up && !this.down) {
      this.rect.y -= 5;
    } else if (this.down && !this.up) {
      this.rect.y += 5;
    }
    this.rect.y = Math.max(0, this.rect.y);
    this.rect.y = Math.min(this.rect.y, this.canvasHeight - this.rect.h);
    this.render(context);
  }
}
