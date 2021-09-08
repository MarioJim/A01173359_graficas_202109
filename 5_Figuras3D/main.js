import * as shaderUtils from '../common/shaderUtils.js';
import Dodecaedro from './dodecaedro.js';
import Escutoide from './escutoide.js';
import Octaedro from './octaedro.js';

const { mat4 } = glMatrix;

let projectionMatrix;

let shaderVertexPositionAttribute,
  shaderVertexColorAttribute,
  shaderProjectionMatrixUniform,
  shaderModelViewMatrixUniform;

const duration = 10000; // ms

// in: Input variables used in the vertex shader. Since the vertex shader is called on each vertex, these will be different every time the vertex shader is invoked.
// Uniforms: Input variables for both the vertex and fragment shaders. These do not change values from vertex to vertex.

const vertexShaderSource = `#version 300 es
in vec3 vertexPos; // Vertex from the buffer
in vec4 vertexColor;

out vec4 color;

uniform mat4 modelViewMatrix; // Object's position
uniform mat4 projectionMatrix; // Camera's position

void main(void) {
    // Return the transformed and projected vertex value
    gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
    color = vertexColor * 0.8;
}`;

const fragmentShaderSource = `#version 300 es
precision mediump float;
in vec4 color;
out vec4 fragColor;

void main(void) {
    fragColor = color;
}`;

function main() {
  const canvas = document.getElementById('webglcanvas');
  const gl = initWebGL(canvas);
  initViewport(gl, canvas);
  initGL(canvas);

  const escutoide = new Escutoide(gl, [-4.5, 0, -4], [1, 1, 0.2]);
  const dodecaedro = new Dodecaedro(gl, [0, 0, -4], [-0.4, 1, 0.1]);
  const octaedro = new Octaedro(gl, [4, 0, -3], [0, 1, 0]);

  const shaderProgram = shaderUtils.initShader(
    gl,
    vertexShaderSource,
    fragmentShaderSource,
  );
  bindShaderAttributes(gl, shaderProgram);

  update(gl, shaderProgram, [escutoide, dodecaedro, octaedro]);
}

function initWebGL(canvas) {
  let gl = null;
  let msg =
    'Your browser does not support WebGL, or it is not enabled by default.';
  try {
    gl = canvas.getContext('webgl2');
  } catch (e) {
    msg = 'Error creating WebGL Context!: ' + e.toString();
  }

  if (!gl) {
    throw new Error(msg);
  }

  return gl;
}

function initViewport(gl, canvas) {
  gl.viewport(0, 0, canvas.width, canvas.height);
}

function initGL(canvas) {
  // Create a project matrix with 45 degree field of view
  projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    Math.PI / 4,
    canvas.width / canvas.height,
    1,
    100,
  );
  mat4.translate(projectionMatrix, projectionMatrix, [0, 0, -5]);
}

function bindShaderAttributes(gl, shaderProgram) {
  // get pointers to the shader params
  shaderVertexPositionAttribute = gl.getAttribLocation(
    shaderProgram,
    'vertexPos',
  );
  gl.enableVertexAttribArray(shaderVertexPositionAttribute);

  shaderVertexColorAttribute = gl.getAttribLocation(
    shaderProgram,
    'vertexColor',
  );
  gl.enableVertexAttribArray(shaderVertexColorAttribute);

  shaderProjectionMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    'projectionMatrix',
  );
  shaderModelViewMatrixUniform = gl.getUniformLocation(
    shaderProgram,
    'modelViewMatrix',
  );
}

function draw(gl, shaderProgram, objs) {
  // clear the background (with black)
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set the shader to use
  gl.useProgram(shaderProgram);

  objs.forEach((obj) => {
    // connect up the shader parameters: vertex position, color and projection/model matrices
    // set up the buffers
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.buffer);
    gl.vertexAttribPointer(
      shaderVertexPositionAttribute,
      obj.vertSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.bindBuffer(gl.ARRAY_BUFFER, obj.colorBuffer);
    gl.vertexAttribPointer(
      shaderVertexColorAttribute,
      obj.colorSize,
      gl.FLOAT,
      false,
      0,
      0,
    );

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indices);

    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(
      shaderModelViewMatrixUniform,
      false,
      obj.modelViewMatrix,
    );

    // Draw the object's primitives using indexed buffer information.
    // void gl.drawElements(mode, count, type, offset);
    // mode: A GLenum specifying the type primitive to render.
    // count: A GLsizei specifying the number of elements to be rendered.
    // type: A GLenum specifying the type of the values in the element array buffer.
    // offset: A GLintptr specifying an offset in the element array buffer.
    gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
  });
}

function update(gl, shaderProgram, objs) {
  // The window.requestAnimationFrame() method tells the browser that you
  // wish to perform an animation and requests that the browser call a
  // specified function to update an animation before the next repaint.
  // The method takes a callback as an argument to be invoked before the repaint.
  requestAnimationFrame(() => update(gl, shaderProgram, objs));

  draw(gl, shaderProgram, objs);

  objs.forEach((obj) => obj.update());
}

main();
