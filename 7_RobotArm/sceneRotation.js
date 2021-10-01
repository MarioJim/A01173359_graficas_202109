export default class SceneRotation {
  /**
   * Adds the mouse events to the canvas
   * @param {HTMLCanvasElement} canvas The canvas element to add the mouse handlers to
   * @param {THREE.Object3D} group The group that is affected by the inputs
   * @param {() => {}} renderFn The function to render the scene again
   */
  constructor(canvas, group, renderFn) {
    this.mouseDown = false;
    this.pageX = 0;
    this.group = group;
    this.renderFn = renderFn;
    canvas.addEventListener('mousemove', this.onMouseMove.bind(this), false);
    canvas.addEventListener('mousedown', this.onMouseDown.bind(this), false);
    canvas.addEventListener('mouseup', this.onMouseUp.bind(this), false);
  }

  /**
   * @param {MouseEvent} evt the mouse event
   */
  onMouseDown(evt) {
    evt.preventDefault();
    this.mouseDown = true;
    this.pageX = evt.pageX;
  }

  /**
   * @param {MouseEvent} evt the mouse event
   */
  onMouseMove(evt) {
    if (!this.mouseDown) return;
    evt.preventDefault();
    let deltaX = evt.pageX - this.pageX;
    this.pageX = evt.pageX;
    this.group.rotation.y += deltaX / 100;
    this.renderFn();
  }

  /**
   * @param {MouseEvent} evt the mouse event
   */
  onMouseUp(evt) {
    evt.preventDefault();
    this.mouseDown = false;
  }
}
