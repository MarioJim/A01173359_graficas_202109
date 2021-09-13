import ColorScale from './colorScale.js';

const { mat4 } = glMatrix;

export default class Pyramid {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {number} subdivisions
   * @param {number[]} translation
   * @param {number[]} rotationAxis
   */
  constructor(gl, subdivisions, translation, rotationAxis) {
    this.rotationAxis = rotationAxis;

    this.setSubdivisions(gl, subdivisions);

    this.modelViewMatrix = mat4.create();
    mat4.translate(this.modelViewMatrix, this.modelViewMatrix, translation);

    this.primtype = gl.TRIANGLES;
    this.currentTime = Date.now();
  }

  /**
   * @param {number[]} v1
   * @param {number[]} v2
   * @param {number[]} v3
   * @param {number} subdivisions
   * @returns
   */
  generateVertPositions(v1, v2, v3, subdivisions) {
    if (subdivisions <= 0) {
      return [...v1, ...v2, ...v3];
    }

    const generateMidpoint = (vA, vB) => vA.map((a, i) => (a + vB[i]) / 2);
    const m1 = generateMidpoint(v1, v2);
    const m2 = generateMidpoint(v1, v3);
    const m3 = generateMidpoint(v3, v2);
    return [
      ...this.generateVertPositions(v1, m1, m2, subdivisions - 1),
      ...this.generateVertPositions(v2, m1, m3, subdivisions - 1),
      ...this.generateVertPositions(v3, m3, m2, subdivisions - 1),
    ];
  }

  /**
   * @param {WebGL2RenderingContext} gl
   * @param {number} subdivisions
   */
  setSubdivisions(gl, subdivisions) {
    // Vertices
    let initV = [
      [Math.sqrt(8 / 9), -1 / 3, 0],
      [-Math.sqrt(2 / 9), -1 / 3, Math.sqrt(2 / 3)],
      [-Math.sqrt(2 / 9), -1 / 3, -Math.sqrt(2 / 3)],
      [0, 1, 0],
    ];
    let verts = [
      ...this.generateVertPositions(initV[0], initV[1], initV[2], subdivisions),
      ...this.generateVertPositions(initV[0], initV[1], initV[3], subdivisions),
      ...this.generateVertPositions(initV[0], initV[3], initV[2], subdivisions),
      ...this.generateVertPositions(initV[3], initV[1], initV[2], subdivisions),
    ];

    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);
    this.vertSize = 3;
    this.nVerts = verts.length / 3;

    // Color data
    let scale = new ColorScale(this.nVerts / 3);
    let colors = scale.getAsVec4(1);
    for (let idx = colors.length - 1; idx >= 0; idx--) {
      const randomIdx = Math.floor(Math.random() * idx);
      const temp = colors[idx];
      colors[idx] = colors[randomIdx];
      colors[randomIdx] = temp;
    }
    colors = colors.flatMap((c) => [...c, ...c, ...c]);
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(colors), gl.STATIC_DRAW);
    this.colorSize = 4;
    this.nColors = colors.length / 4;

    // Index data (defines the triangles to be drawn)
    this.indicesBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuffer);
    let indices = Array.from(Array(this.nVerts)).map((_, i) => i);
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(indices),
      gl.STATIC_DRAW,
    );
    this.nIndices = indices.length;
  }

  update() {
    let now = Date.now();
    let deltat = now - this.currentTime;
    this.currentTime = now;
    let fract = deltat / 10000;
    let angle = Math.PI * 2 * fract;

    mat4.rotate(
      this.modelViewMatrix,
      this.modelViewMatrix,
      angle,
      this.rotationAxis,
    );
  }
}
