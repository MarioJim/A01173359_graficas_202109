export default class ColorScale {
  /**
   * @param {number} nColors number of colors for this color scale
   */
  constructor(nColors) {
    this.colors = Array.from(Array(nColors)).map((_, i) =>
      this.hsvToRgb(i / nColors, 0.9, 0.9),
    );
  }

  /**
   * @param {number} h hue
   * @param {number} s saturation
   * @param {number} v value
   * @returns {{r: number, g: number, b: number}} color
   */
  hsvToRgb(h, s, v) {
    // From StackOverflow
    // https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
    const i = Math.floor(h * 6);
    const f = h * 6 - i;
    const p = v * (1 - s);
    const q = v * (1 - f * s);
    const t = v * (1 - (1 - f) * s);
    let r, g, b;
    switch (i % 6) {
      case 0:
        (r = v), (g = t), (b = p);
        break;
      case 1:
        (r = q), (g = v), (b = p);
        break;
      case 2:
        (r = p), (g = v), (b = t);
        break;
      case 3:
        (r = p), (g = q), (b = v);
        break;
      case 4:
        (r = t), (g = p), (b = v);
        break;
      case 5:
        (r = v), (g = p), (b = q);
        break;
    }
    return { r, g, b };
  }

  /**
   * @param {number} alpha transparency of the color
   * @returns {number[][]} list of colors as vectors of 4 elements
   */
  getAsVec4(alpha) {
    return this.colors.map(({ r, g, b }) => [r, g, b, alpha]);
  }
}
