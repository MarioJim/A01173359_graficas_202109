export default class Pacman {
  constructor(gl, center) {
    this.gl = gl;
    this.x = center[0];
    this.y = center[1];
  }

  render(mouthAngle) {
    const vertexBuffer = this.gl.createBuffer();
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, vertexBuffer);
    mouthAngle = (mouthAngle * Math.PI) / 180;
    const start = mouthAngle / 2;
    const end = 2 * Math.PI - mouthAngle / 2;
    const points = 100;
    const verts = [this.x, this.y, 0];
    for (let i = 0; i <= points; i++) {
      const angle = start + (i * (end - start)) / points;
      verts.push(
        Math.cos(angle) * 0.4 + this.x,
        Math.sin(angle) * 0.4 + this.y,
        0,
      );
    }
    this.gl.bufferData(
      this.gl.ARRAY_BUFFER,
      new Float32Array(verts),
      this.gl.STATIC_DRAW,
    );
    return {
      buffer: vertexBuffer,
      vertSize: 3,
      nVerts: verts.length / 3,
      primtype: this.gl.TRIANGLE_FAN,
    };
  }
}
