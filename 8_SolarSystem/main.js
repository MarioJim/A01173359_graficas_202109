import * as THREE from 'https://threejs.org/build/three.module.js';
import { OrbitControls } from 'https://threejs.org/examples/jsm/controls/OrbitControls.js';

import { loadAsteroidBelt } from './asteroid.js';
import { createPlanet, createSphereWithTextures } from './planet.js';
import loadTextures from './textures.js';

let currentTime = Date.now();
let renderer = null,
  scene = null,
  camera = null,
  controls = null,
  asteroids = null,
  sun = null,
  mercuryGroup = null,
  mercury = null,
  venusGroup = null,
  venus = null,
  earthGroup = null,
  moonGroup = null,
  earth = null,
  moon = null,
  marsGroup = null,
  mars = null,
  jupiterGroup = null,
  jupiter = null,
  saturnGroup = null,
  saturn = null,
  uranusGroup = null,
  uranus = null,
  neptuneGroup = null,
  neptune = null,
  plutoGroup = null,
  pluto = null;

const animate = () => {
  // Call animate again on the next frame
  requestAnimationFrame(animate);

  // Calculate delta time
  const now = Date.now();
  const deltat = now - currentTime;
  currentTime = now;
  const fract = deltat / 100000;

  // Asteroids rotation
  asteroids.forEach((asteroid, i) => {
    asteroid.rotateY(((i % 3) + 1) * fract * 2 * Math.PI);
  });

  // Planet traslations
  mercuryGroup.rotateY(fract * 2 * Math.PI);
  venusGroup.rotateY(-fract * 2 * Math.PI);
  earthGroup.rotateY(fract * 2 * Math.PI);
  moonGroup.rotateY(10 * fract * 2 * Math.PI);
  marsGroup.rotateY(fract * 2 * Math.PI);
  jupiterGroup.rotateY(fract * 2 * Math.PI);
  saturnGroup.rotateY(fract * 2 * Math.PI);
  uranusGroup.rotateY(fract * 2 * Math.PI);
  neptuneGroup.rotateY(fract * 2 * Math.PI);
  plutoGroup.rotateY(fract * 2 * Math.PI);

  // Planet rotations
  mercury.rotateY(4 * fract * 2 * Math.PI);
  venus.rotateY(4 * fract * 2 * Math.PI);
  earth.rotateY(4 * fract * 2 * Math.PI);
  moon.rotateY(10 * fract * 2 * Math.PI);
  mars.rotateY(4 * fract * 2 * Math.PI);
  jupiter.rotateY(4 * fract * 2 * Math.PI);
  saturn.rotateY(4 * fract * 2 * Math.PI);
  uranus.rotateY(4 * fract * 2 * Math.PI);
  neptune.rotateY(4 * fract * 2 * Math.PI);
  pluto.rotateY(4 * fract * 2 * Math.PI);

  // Update camera's position
  controls.update();

  // Render the scene
  renderer.render(scene, camera);
};

/**
 * Creates a basic scene with lights, a camera, and 3 objects
 * @param {HTMLCanvasElement} canvas The canvas element to render on
 */
const createScene = async (canvas) => {
  // Create the Three.js renderer and attach it to our canvas
  renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setSize(canvas.width, canvas.height);

  // Create a new Three.js scene
  scene = new THREE.Scene();
  scene.background = new THREE.Color(0.1, 0.1, 0.1);

  // Add a camera so we can view the scene
  camera = new THREE.PerspectiveCamera(
    40,
    canvas.width / canvas.height,
    1,
    4000,
  );
  camera.position.z = 10;
  camera.position.y = 4;

  // Add the controls needed to move the camera
  controls = new OrbitControls(camera, renderer.domElement);

  // Create a light in the Sun's position
  const light = new THREE.PointLight('white', 1, 0, 4);
  light.position.set(0, 0, 0);
  scene.add(light);

  // Load the planet textures and the asteroid object
  const [planetTextures, { asteroidBeltGroup, asteroidList }] =
    await Promise.all([loadTextures(), loadAsteroidBelt(75, 2.4, 3.1)]);

  // Setup asteroids
  asteroids = asteroidList;
  scene.add(asteroidBeltGroup);

  // Add the Sun
  sun = createSphereWithTextures(0.4, {
    ...planetTextures.sun,
    emissive: '#E8E053',
  });
  scene.add(sun);

  // Add Mercury
  const mercuryStruct = createPlanet(0.08, 0.8, planetTextures.mercury);
  ({ group: mercuryGroup, planet: mercury } = mercuryStruct);
  scene.add(mercuryGroup);
  scene.add(mercuryStruct.orbit);

  // Add Venus
  const venusStruct = createPlanet(0.09, 1.2, planetTextures.venus);
  ({ group: venusGroup, planet: venus } = venusStruct);
  scene.add(venusGroup);
  scene.add(venusStruct.orbit);

  // Add the Earth
  const earthDistance = 1.6;
  const earthStruct = createPlanet(0.1, earthDistance, planetTextures.earth);
  ({ group: earthGroup, planet: earth } = earthStruct);
  scene.add(earthStruct.orbit);

  // Add the moon
  const moonStruct = createPlanet(0.04, 0.25, planetTextures.moon);
  ({ group: moonGroup, planet: moon } = moonStruct);
  moonGroup.position.set(earthDistance, 0, 0);
  moonStruct.orbit.position.set(earthDistance, 0, 0);
  earthGroup.add(moonGroup);
  earthGroup.add(moonStruct.orbit);
  scene.add(earthGroup);

  // Add Mars
  const marsStruct = createPlanet(0.1, 2.0, planetTextures.mars);
  ({ group: marsGroup, planet: mars } = marsStruct);
  scene.add(marsGroup);
  scene.add(marsStruct.orbit);

  // Add Jupiter
  const jupiterStruct = createPlanet(0.2, 3.5, planetTextures.jupiter);
  ({ group: jupiterGroup, planet: jupiter } = jupiterStruct);
  scene.add(jupiterGroup);
  scene.add(jupiterStruct.orbit);

  // Add Saturn
  const saturnStruct = createPlanet(0.2, 4.0, planetTextures.saturn);
  ({ group: saturnGroup, planet: saturn } = saturnStruct);
  scene.add(saturnGroup);
  scene.add(saturnStruct.orbit);

  // Add Uranus
  const uranusStruct = createPlanet(0.15, 4.5, planetTextures.uranus);
  ({ group: uranusGroup, planet: uranus } = uranusStruct);
  scene.add(uranusGroup);
  scene.add(uranusStruct.orbit);

  // Add Neptune
  const neptuneStruct = createPlanet(0.15, 5.0, planetTextures.neptune);
  ({ group: neptuneGroup, planet: neptune } = neptuneStruct);
  scene.add(neptuneGroup);
  scene.add(neptuneStruct.orbit);

  // Add Pluto
  const plutoStruct = createPlanet(0.07, 5.5, planetTextures.pluto);
  ({ group: plutoGroup, planet: pluto } = plutoStruct);
  scene.add(plutoGroup);
  scene.add(plutoStruct.orbit);
};

// main
(async () => {
  const canvas = document.getElementById('webglcanvas');
  await createScene(canvas);
  animate();
})();
