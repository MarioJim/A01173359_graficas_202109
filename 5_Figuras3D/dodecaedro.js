import ColorScale from './colorScale.js';

export default class Dodecaedro {
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

    const p = (1 + Math.sqrt(5)) / 2;
    const r = 1 / p;
    // prettier-ignore
    const verts = [
      // Top, negative y
      -r,  0,  p, 
       r,  0,  p, 
       1, -1,  1,
       0, -p,  r,
      -1, -1,  1,
      // Top, positive y
       r,  0,  p, 
      -r,  0,  p, 
      -1,  1,  1,
       0,  p,  r,
       1,  1,  1,
      // Front, negative x
       0, -p,  r,
       0, -p, -r,
      -1, -1, -1, 
      -p, -r,  0, 
      -1, -1,  1,
      // Front, positive x
       0, -p,  r,
       1, -1,  1,
       p, -r,  0, 
       1, -1, -1, 
       0, -p, -r,
      // Right, negative z
       p, -r,  0, 
       p,  r,  0, 
       1,  1, -1, 
       r,  0, -p, 
       1, -1, -1, 
      // Right, positive z
       r,  0,  p, 
       1,  1,  1, 
       p,  r,  0, 
       p, -r,  0, 
       1, -1,  1, 
      // Bottom, negative y
      -r,  0, -p, 
       r,  0, -p, 
       1, -1, -1,
       0, -p, -r,
      -1, -1, -1,
      // Bottom, positive y
       r,  0, -p, 
      -r,  0, -p, 
      -1,  1, -1,
       0,  p, -r,
       1,  1, -1,
      // Back, negative x
       0,  p,  r,
       0,  p, -r,
      -1,  1, -1, 
      -p,  r,  0, 
      -1,  1,  1,
      // Back, positive x
       0,  p,  r,
       1,  1,  1,
       p,  r,  0, 
       1,  1, -1, 
       0,  p, -r,
      // Left, negative z
      -p, -r,  0, 
      -p,  r,  0, 
      -1,  1, -1, 
      -r,  0, -p, 
      -1, -1, -1, 
      // Left, positive z
      -r,  0,  p, 
      -1,  1,  1, 
      -p,  r,  0, 
      -p, -r,  0, 
      -1, -1,  1, 
    ];

    const vertexPerFace = 5;
    this.vertSize = 3;
    this.nVerts = verts.length / this.vertSize;
    const nFaces = this.nVerts / vertexPerFace;

    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(verts), gl.STATIC_DRAW);

    // Color data
    this.colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.colorBuffer);

    const faceColors = new ColorScale(nFaces).getAsVec4(1);

    // Each vertex must have the color information, that is why the same color
    // is concatenated 5 times, one for each vertex of the dodecahedron's face.
    const vertexColors = faceColors.flatMap((c) => c.concat(c, c, c, c));
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

    const face = [0, 1, 2, 0, 2, 3, 0, 3, 4];
    const dodecahedronIndices = Array.from(Array(nFaces)).flatMap((_, i) =>
      face.map((e) => e + i * vertexPerFace),
    );

    // gl.ELEMENT_ARRAY_BUFFER: Buffer used for element indices.
    // Uint16Array: Array of 16-bit unsigned integers.
    gl.bufferData(
      gl.ELEMENT_ARRAY_BUFFER,
      new Uint16Array(dodecahedronIndices),
      gl.STATIC_DRAW,
    );

    this.nIndices = dodecahedronIndices.length;
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
