import Pyramid from './pyramid.js';

let projectionMatrix = null,
  shaderProgram = null;

let shaderVertexPositionAttribute = null,
  shaderVertexColorAttribute = null,
  shaderProjectionMatrixUniform = null,
  shaderModelViewMatrixUniform = null;

let mat4 = glMatrix.mat4;

let vertexShaderSource = `#version 300 es
in vec3 vertexPos;
in vec4 vertexColor;

uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;

out vec4 vColor;

void main(void) {
  // Return the transformed and projected vertex value
  gl_Position = projectionMatrix * modelViewMatrix * vec4(vertexPos, 1.0);
  // Output the vertexColor in vColor
  vColor = vertexColor;
}`;

let fragmentShaderSource = `#version 300 es
precision lowp float;
in vec4 vColor;
out vec4 fragColor;

void main(void) {
  // Return the pixel color: always output white
  fragColor = vColor;
}`;

function createShader(glCtx, str, type) {
  let shader = null;

  if (type == 'fragment') shader = glCtx.createShader(glCtx.FRAGMENT_SHADER);
  else if (type == 'vertex') shader = glCtx.createShader(glCtx.VERTEX_SHADER);
  else return null;

  glCtx.shaderSource(shader, str);
  glCtx.compileShader(shader);

  if (!glCtx.getShaderParameter(shader, glCtx.COMPILE_STATUS)) {
    throw new Error(glCtx.getShaderInfoLog(shader));
  }

  return shader;
}

function initShader(glCtx, vertexShaderSource, fragmentShaderSource) {
  const vertexShader = createShader(glCtx, vertexShaderSource, 'vertex');
  const fragmentShader = createShader(glCtx, fragmentShaderSource, 'fragment');

  let shaderProgram = glCtx.createProgram();

  glCtx.attachShader(shaderProgram, vertexShader);
  glCtx.attachShader(shaderProgram, fragmentShader);
  glCtx.linkProgram(shaderProgram);

  if (!glCtx.getProgramParameter(shaderProgram, glCtx.LINK_STATUS)) {
    throw new Error('Could not initialise shaders');
  }

  return shaderProgram;
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

function initGL(gl, canvas) {
  gl.clearColor(0.0, 0.0, 0.0, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT);

  projectionMatrix = mat4.create();
  mat4.perspective(
    projectionMatrix,
    Math.PI / 4,
    canvas.width / canvas.height,
    1,
    100,
  );
}

function draw(gl, objs) {
  // clear the background (with black)
  gl.clearColor(0.1, 0.1, 0.1, 1.0);
  gl.enable(gl.DEPTH_TEST);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  // set the shader to use
  gl.useProgram(shaderProgram);

  objs.forEach((obj) => {
    gl.bindBuffer(gl.ARRAY_BUFFER, obj.vertexBuffer);
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

    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, obj.indicesBuffer);

    gl.uniformMatrix4fv(shaderProjectionMatrixUniform, false, projectionMatrix);
    gl.uniformMatrix4fv(
      shaderModelViewMatrixUniform,
      false,
      obj.modelViewMatrix,
    );

    gl.drawElements(obj.primtype, obj.nIndices, gl.UNSIGNED_SHORT, 0);
  });
}

function update(glCtx, objs) {
  requestAnimationFrame(() => update(glCtx, objs));

  draw(glCtx, objs);
  objs.forEach((obj) => obj.update());
}

function bindShaderAttributes(glCtx, shaderProgram) {
  shaderVertexPositionAttribute = glCtx.getAttribLocation(
    shaderProgram,
    'vertexPos',
  );
  glCtx.enableVertexAttribArray(shaderVertexPositionAttribute);

  shaderVertexColorAttribute = glCtx.getAttribLocation(
    shaderProgram,
    'vertexColor',
  );
  glCtx.enableVertexAttribArray(shaderVertexColorAttribute);

  shaderProjectionMatrixUniform = glCtx.getUniformLocation(
    shaderProgram,
    'projectionMatrix',
  );
  shaderModelViewMatrixUniform = glCtx.getUniformLocation(
    shaderProgram,
    'modelViewMatrix',
  );
}

function main() {
  let canvas = document.getElementById('pyramidCanvas');
  let glCtx = initWebGL(canvas);

  initViewport(glCtx, canvas);
  initGL(glCtx, canvas);

  let pyramid = new Pyramid(glCtx, 2, [0, -0.2, -2.5], [0, 1, 0]);

  const slider = document.getElementById('slider');
  slider.addEventListener('input', (e) => {
    const label = document.getElementById('sliderLabel');
    label.textContent = `Subdivisiones: ${e.target.value}`;
    pyramid.setSubdivisions(glCtx, e.target.value);
  });

  shaderProgram = initShader(glCtx, vertexShaderSource, fragmentShaderSource);
  bindShaderAttributes(glCtx, shaderProgram);

  update(glCtx, [pyramid]);
}

main();
