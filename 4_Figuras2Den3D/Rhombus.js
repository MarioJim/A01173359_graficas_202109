export default class Rhombus {
  constructor(gl, center) {
    this.gl = gl;
    this.vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, this.vertexBuffer);
    const [x, y] = center;
    this.verts = [
      0.0 + x,
      -0.4 + y,
      0.0,
      -0.4 + x,
      0.0 + y,
      0.0,
      0.4 + x,
      0.0 + y,
      0.0,
      0.0 + x,
      0.4 + y,
      0.0,
    ];
    gl.bufferData(
      gl.ARRAY_BUFFER,
      new Float32Array(this.verts),
      gl.STATIC_DRAW,
    );
  }

  render() {
    return {
      buffer: this.vertexBuffer,
      vertSize: 3,
      nVerts: this.verts.length / 3,
      primtype: this.gl.TRIANGLE_STRIP,
    };
  }
}
