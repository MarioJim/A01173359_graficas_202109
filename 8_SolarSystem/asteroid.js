import * as THREE from 'https://threejs.org/build/three.module.js';
import { GLTFLoader } from 'https://threejs.org/examples/jsm/loaders/GLTFLoader.js';

/**
 * Loads the asteroid object and creates a belt with it
 * @returns {Object}
 */
export const loadAsteroidBelt = async (
  numAsteroids,
  minDistance,
  maxDistance,
) => {
  const asteroidModel = await loadAsteroid();
  const asteroidList = new Array(numAsteroids).fill(0).map((_) => {
    const asteroidGroup = new THREE.Group();
    asteroidGroup.rotateY(Math.random() * 2 * Math.PI);
    const asteroid = asteroidModel.clone();
    asteroid.position.z =
      minDistance + Math.random() * (maxDistance - minDistance);
    asteroidGroup.add(asteroid);
    return asteroidGroup;
  });

  const asteroidBeltGroup = new THREE.Group();
  asteroidList.forEach((asteroid) => asteroidBeltGroup.add(asteroid));

  return { asteroidBeltGroup, asteroidList };
};

const loadAsteroid = async () => {
  // Load the scene from the gltf file
  const loader = new GLTFLoader();
  const { scene } = await loader.loadAsync('models/asteroid.gltf');

  // Select the asteroid from the scene, scale it and recolor it
  const object =
    scene.children[0].children[0].children[0].children[0].children[0];
  const scale = 0.05;
  object.scale.set(scale, scale, scale);
  object.material.color = new THREE.Color('grey');

  return object;
};
