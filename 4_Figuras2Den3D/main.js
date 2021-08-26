import { initShader } from '../common/shaderUtils.js';
import Pacman from './Pacman.js';
import Rhombus from './Rhombus.js';
import Square from './Square.js';
import Triangle from './Triangle.js';

const { mat4 } = glMatrix;

let projectionMatrix, modelViewMatrix;

let shaderVertexPositionAttribute,
  shaderProjectionMatrixUniform,
  shaderModelViewMatrixUniform;

const vertexShaderSrc = `#version 300 es
in vec3 vertexPos; // Vertex from the buffer
uniform mat4 modelViewMatrix; // Object's position
uniform mat4 projectionMatrix; // Camera's position

void main(void) {
  // Return the transformed and projected vertex value
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
}`;

const fragmentShaderSrc = `#version 300 es
precision mediump float;
out vec4 fragColor;

void main(void) {
  // Return the pixel color: always output white
  fragColor = vec4(1.0, 1.0, 1.0, 1.0);
}`;

function bindShaderAttributes(gl, shaderProgram) {
  shaderVertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    'vertexPos',
  );
  gl.enableVertexAttribArray(shaderVertexPositionAttribute);

  shaderProjectionMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    'projectionMatrix',
  );
  shaderModelViewMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    'modelViewMatrix',
  );
}

function draw(gl, shaderProgram, obj) {
  gl.useProgram(shaderProgram);
  gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
  gl.vertexAttribPointer(
    shaderVertexPositionAttribute,
    obj.vertSize,
    gl.FLOAT,
    false,
    0,
    0,
  );
  gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
  gl.uniformMatrix4fv(shaderModelViewMatrixUniform, false, modelViewMatrix);
  gl.drawArrays(obj.primtype, 0, obj.nVerts);
}

window.addEventListener('load', () => {
  const canvas = document.getElementById('webglcanvas');
  const gl = canvas.getContext('webgl2');

  let mouthAngle = 90;

  const mouthAngleSlider = document.getElementById('slider');
  const mouthAngleLabel = document.getElementById('sliderLabel');
  mouthAngleSlider.addEventListener('input', (ev) => {
    mouthAngle = ev.target.value;
    mouthAngleLabel.textContent = `Ángulo de la boca de Pacman: ${mouthAngle}`;
    render();
  });

  const square = new Square(gl, [-0.7, 0.5]);
  const triangle = new Triangle(gl, [0.7, 0.5]);
  const rhombus = new Rhombus(gl, [-0.7, -0.5]);
  const pacman = new Pacman(gl, [0.7, -0.5]);

  const render = () => {
    // Init GL
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Init viewport
    gl.viewport(0, 0, canvas.width, canvas.height);

    // Init matrices
    modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, [0, 0, -3]);
    projectionMatrix = mat4.create();
    const aspect = canvas.width / canvas.height;
    mat4.perspective(projectionMatrix, Math.PI / 4, aspect, 1, 5);

    // Init shader
    const shaderProgram = initShader(gl, vertexShaderSrc, fragmentShaderSrc);
    bindShaderAttributes(gl, shaderProgram);

    draw(gl, shaderProgram, square.render());
    draw(gl, shaderProgram, triangle.render());
    draw(gl, shaderProgram, rhombus.render());
    draw(gl, shaderProgram, pacman.render(mouthAngle));
  };

  render();
});
