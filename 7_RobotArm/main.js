// Para importar dependencias con npm
// import * as THREE from './node_modules/three/build/three.module.js';
// import * as dat from './node_modules/dat.gui/build/dat.gui.module.js';

import * as THREE from 'https://unpkg.com/three@0.133.0/build/three.module.js';
import * as dat from 'https://unpkg.com/dat.gui@0.7.7/build/dat.gui.module.js';

import SceneRotation from './sceneRotation.js';

let renderer = null,
  scene = null,
  camera = null,
  shoulderGroup = null,
  shoulder = null,
  arm = null,
  elbowGroup = null,
  elbow = null,
  forearmGroup = null,
  forearm = null,
  wristGroup = null,
  wrist = null,
  handGroup = null,
  hand = null;

const state = {
  shoulderX: 0.1,
  shoulderZ: 0.1,
  elbowX: 0.1,
  forearmY: 0.1,
  wristX: 0.1,
  handX: 0.1,
  handZ: 0.1,
};

const render = () => {
  // Update the shoulder's position
  shoulderGroup.rotation.x = state.shoulderX;
  shoulderGroup.rotation.z = state.shoulderZ;
  shoulderGroup.updateMatrixWorld();
  shoulder.updateMatrixWorld();
  arm.updateMatrixWorld();

  // Update the elbow's position
  elbowGroup.rotation.x = -state.elbowX;
  elbowGroup.updateMatrixWorld();
  elbow.updateMatrixWorld();

  // Update the forearm's position
  forearmGroup.rotation.y = state.forearmY;
  forearmGroup.updateMatrixWorld();
  forearm.updateMatrixWorld();

  // Update the wrists's position
  wristGroup.rotation.x = state.wristX;
  wristGroup.updateMatrixWorld();
  wrist.updateMatrixWorld();

  // Update the hand's position
  handGroup.rotation.x = state.handX;
  handGroup.rotation.z = state.handZ;
  handGroup.updateMatrixWorld();
  hand.updateMatrixWorld();

  // Render the scene
  renderer.render(scene, camera);
};

function main() {
  const canvas = document.getElementById('webglcanvas');
  createScene(canvas);
  createControls();
}

const createControls = () => {
  const gui = new dat.GUI();
  gui.add(state, 'shoulderX', -1, 1).onChange(render);
  gui.add(state, 'shoulderZ', -1, 1).onChange(render);
  gui.add(state, 'elbowX', 0, 2).onChange(render);
  gui.add(state, 'forearmY', -2, 1).onChange(render);
  gui.add(state, 'wristX', -1, 1).onChange(render);
  gui.add(state, 'handX', -1, 1).onChange(render);
  gui.add(state, 'handZ', -0.7, 0.7).onChange(render);
};

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {HTMLCanvasElement} canvas The canvas element to render on
 */
function createScene(canvas) {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });

  // Set the viewport size
  renderer.setSize(canvas.width, canvas.height);

  // Create a new Three.js scene
  scene = new THREE.Scene();

  // Set the background color
  scene.background = new THREE.Color(0.2, 0.2, 0.2);

  // Add  a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(
    40,
    canvas.width / canvas.height,
    1,
    4000,
  );
  camera.position.z = 10;
  scene.add(camera);

  // Add a directional light to show off the objects
  const light = new THREE.DirectionalLight(0xffffff, 1.0);

  // Position the light out from the scene, pointing at the origin
  light.position.set(-0.5, 0.2, 1);
  light.target.position.set(0, -2, 0);
  scene.add(light);

  // This light globally illuminates all objects in the scene equally.
  // Cannot cast shadows
  const ambientLight = new THREE.AmbientLight(0xffccaa, 0.2);
  scene.add(ambientLight);

  // Use a normal material
  const material = new THREE.MeshNormalMaterial();

  // Measurements for the arm parts
  const jointSize = 0.3;
  const extremityWidth = 0.4;
  const armLen = 2;
  const forearmLen = 1.8;
  const handLen = 0.6;
  const handWidth = 0.5;
  const sep = jointSize / 3;

  // Create a group to hold all the objects
  shoulderGroup = new THREE.Object3D();
  shoulderGroup.position.set(0, 3, 0);
  scene.add(shoulderGroup);

  // Create the shoulder
  shoulder = new THREE.Mesh(
    new THREE.BoxGeometry(jointSize, jointSize, jointSize),
    material,
  );
  shoulderGroup.add(shoulder);

  // Create the arm
  arm = new THREE.Mesh(
    new THREE.BoxGeometry(extremityWidth, armLen, extremityWidth),
    material,
  );
  arm.position.set(0, -(armLen + sep) / 2, 0);
  shoulderGroup.add(arm);

  // Create the elbow group
  elbowGroup = new THREE.Object3D();
  elbowGroup.position.set(0, -(armLen + sep), 0);
  shoulderGroup.add(elbowGroup);

  // Create the elbow
  elbow = new THREE.Mesh(
    new THREE.BoxGeometry(jointSize, jointSize, jointSize),
    material,
  );
  elbowGroup.add(elbow);

  // Create the forearm group
  forearmGroup = new THREE.Object3D();
  forearmGroup.position.set(0, -sep, 0);
  elbowGroup.add(forearmGroup);

  // Create the forearm
  forearm = new THREE.Mesh(
    new THREE.BoxGeometry(extremityWidth, forearmLen, extremityWidth),
    material,
  );
  forearm.position.set(0, -(forearmLen + sep) / 2, 0);
  forearmGroup.add(forearm);

  // Create the wrist group
  wristGroup = new THREE.Object3D();
  wristGroup.position.set(0, -(forearmLen + sep), 0);
  forearmGroup.add(wristGroup);

  // Create the wrist
  wrist = new THREE.Mesh(
    new THREE.BoxGeometry(jointSize, jointSize, jointSize),
    material,
  );
  wristGroup.add(wrist);

  // Create the hand group
  handGroup = new THREE.Object3D();
  handGroup.position.set(0, -jointSize, 0);
  wristGroup.add(handGroup);

  // Create the hand
  hand = new THREE.Mesh(
    new THREE.BoxGeometry(handWidth, handLen, jointSize),
    material,
  );
  hand.position.set(0, -sep, 0);
  handGroup.add(hand);

  // Add scene rotation through mouse
  new SceneRotation(canvas, shoulderGroup, render);

  // Render the scene
  render();
}

main();
