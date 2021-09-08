import ColorScale from './colorScale.js';

export default class Escutoide {
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

    const verts_top_pentagon = Array.from(Array(5)).map((_, i) => [
      Math.cos((2 * Math.PI * (i + 0.5)) / 5),
      Math.sin((2 * Math.PI * (i + 0.5)) / 5),
      1,
    ]);
    const verts_bot_hexagon = Array.from(Array(6)).map((_, i) => [
      Math.cos((2 * Math.PI * (i + 0.5)) / 6),
      Math.sin((2 * Math.PI * (i + 0.5)) / 6),
      -1,
    ]);
    const vert_joined_center = [-1, 0, 0];

    const verts = [
      // Top pentagon
      ...verts_top_pentagon[0],
      ...verts_top_pentagon[1],
      ...verts_top_pentagon[2],
      ...verts_top_pentagon[3],
      ...verts_top_pentagon[4],
      // Bottom hexagon
      ...verts_bot_hexagon[5],
      ...verts_bot_hexagon[4],
      ...verts_bot_hexagon[3],
      ...verts_bot_hexagon[2],
      ...verts_bot_hexagon[1],
      ...verts_bot_hexagon[0],
      // Shared side
      ...verts_top_pentagon[4],
      ...verts_top_pentagon[0],
      ...verts_bot_hexagon[0],
      ...verts_bot_hexagon[5],
      // Right side to shared side
      ...verts_top_pentagon[0],
      ...verts_top_pentagon[1],
      ...verts_bot_hexagon[1],
      ...verts_bot_hexagon[0],
      // Right to right side
      ...verts_top_pentagon[1],
      ...verts_top_pentagon[2],
      ...vert_joined_center,
      ...verts_bot_hexagon[2],
      ...verts_bot_hexagon[1],
      // Bottom triangle
      ...vert_joined_center,
      ...verts_bot_hexagon[3],
      ...verts_bot_hexagon[2],
      // Left to left side
      ...verts_top_pentagon[2],
      ...verts_top_pentagon[3],
      ...verts_bot_hexagon[4],
      ...verts_bot_hexagon[3],
      ...vert_joined_center,
      // Left side to shared side
      ...verts_top_pentagon[3],
      ...verts_top_pentagon[4],
      ...verts_bot_hexagon[5],
      ...verts_bot_hexagon[4],
    ];

    this.vertSize = 3;
    this.nVerts = verts.length / this.vertSize;
    const nVertsPerFace = [5, 6, 4, 4, 5, 3, 5, 4];
    const nFaces = nVertsPerFace.length;
    const cumsum = (
      (sum) => (val) =>
        (sum += val)
    )(0);
    const cumVertsPerFace = nVertsPerFace.map(cumsum);

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

    const faceColors = new ColorScale(nFaces).getAsVec4(1);

    // Each vertex must have the color information, that is why the same color
    // is concatenated the number of vertices per face times
    const vertexColors = faceColors.flatMap((c, i) =>
      Array.from(Array(nVertsPerFace[i])).flatMap((_) => c),
    );
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

    const scutoidIndices = nVertsPerFace.flatMap((v, i) =>
      Array.from(Array(v - 2))
        .flatMap((_, i) => [0, i + 1, i + 2])
        .map((e) => e + cumVertsPerFace[i] - v),
    );

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(scutoidIndices),
      gl.STATIC_DRAW,
    );

    this.nIndices = scutoidIndices.length;
    this.primtype = gl.TRIANGLES;
    this.modelViewMatrix = glMatrix.mat4.create();
    this.currentTime = Date.now();

    glMatrix.mat4.translate(
      this.modelViewMatrix,
      this.modelViewMatrix,
      translation,
    );
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
  }
}
