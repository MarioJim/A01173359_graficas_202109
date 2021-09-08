import ColorScale from './colorScale.js';

export default class Octaedro {
  /**
   * @param {WebGL2RenderingContext} gl
   * @param {number[]} translation
   * @param {number[]} rotationAxis
   */
  constructor(gl, translation, rotationAxis) {
    this.rotationAxis = rotationAxis;

    // Vertex Data
    this.buffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);

    const vs = {
      top: [0, 0, 1],
      bot: [0, 0, -1],
      back: [0, 1, 0],
      front: [0, -1, 0],
      right: [1, 0, 0],
      left: [-1, 0, 0],
    };
    // prettier-ignore
    const verts = [
      // 4 faces above
      ...vs.top, ...vs.back,  ...vs.right,
      ...vs.top, ...vs.left,  ...vs.back,
      ...vs.top, ...vs.front, ...vs.left,
      ...vs.top, ...vs.right, ...vs.front,
      // 4 faces below
      ...vs.bot, ...vs.back,  ...vs.right,
      ...vs.bot, ...vs.left,  ...vs.back,
      ...vs.bot, ...vs.front, ...vs.left,
      ...vs.bot, ...vs.right, ...vs.front,
    ];

    const vertexPerFace = 3;
    this.vertSize = 3;
    this.nVerts = verts.length / this.vertSize;
    const nFaces = this.nVerts / vertexPerFace;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

    const faceColors = new ColorScale(nFaces).getAsVec4(1);

    // Each vertex must have the color information, that is why the same color
    // is concatenated 3 times, one for each vertex of the octahedron's face.
    const vertexColors = faceColors.flatMap((c) => c.concat(c, c));
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(vertexColors),
      gl.STATIC_DRAW,
    );

    this.colorSize = 4;
    this.nColors = vertexColors.length / this.colorSize;

    // Index data (defines the triangles to be drawn).
    this.indices = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indices);

    const octahedronIndices = Array.from(Array(nFaces)).flatMap((_, i) =>
      [0, 1, 2].map((e) => e + i * vertexPerFace),
    );

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(octahedronIndices),
      gl.STATIC_DRAW,
    );

    this.nIndices = octahedronIndices.length;
    this.primtype = gl.TRIANGLES;
    this.modelViewMatrix = glMatrix.mat4.create();
    this.currentTime = Date.now();

    glMatrix.mat4.translate(
      this.modelViewMatrix,
      this.modelViewMatrix,
      translation,
    );
    this.velocity = [0, 0.02, 0];
  }

  update() {
    const now = Date.now();
    const deltat = now - this.currentTime;
    this.currentTime = now;
    const angle = (2 * Math.PI * deltat) / 10000;

    // Rotates a mat4 by the given angle
    // mat4 out the receiving matrix
    // mat4 a the matrix to rotate
    // Number rad the angle to rotate the matrix by
    // vec3 axis the axis to rotate around
    glMatrix.mat4.rotate(
      this.modelViewMatrix,
      this.modelViewMatrix,
      angle,
      this.rotationAxis,
    );

    const limit = 2.3;
    if (this.modelViewMatrix[13] > limit || this.modelViewMatrix[13] < -limit) {
      this.velocity = this.velocity.map((x) => -x);
    }
    glMatrix.mat4.translate(
      this.modelViewMatrix,
      this.modelViewMatrix,
      this.velocity,
    );
  }
}
