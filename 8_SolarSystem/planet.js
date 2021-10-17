import * as THREE from 'https://threejs.org/build/three.module.js';

/**
 * @typedef {Object} PlanetStruct
 * @property {THREE.Group} group
 * @property {THREE.Mesh} planet
 * @property {THREE.Mesh} orbit
 */

/**
 * Creates a planet
 * @param {number} planetRadius
 * @param {number} planetDistance
 * @param {Object} textures
 * @returns {PlanetStruct}
 */
export const createPlanet = (planetRadius, planetDistance, textures) => {
  const group = new THREE.Group();
  group.rotateY(Math.random() * 2 * Math.PI);

  const planet = createSphereWithTextures(planetRadius, textures);
  planet.position.set(planetDistance, 0, 0);
  group.add(planet);

  const orbit = new THREE.Mesh(
    new THREE.RingGeometry(planetDistance, planetDistance + 0.01, 64),
    new THREE.MeshBasicMaterial({ color: 'grey', side: THREE.DoubleSide }),
  );
  orbit.rotateX(Math.PI / 2);

  return { group, planet, orbit };
};

/**
 * Creates a THREE.Mesh with a mesh phong material and a sphere geometry
 * @param {number} radius
 * @param {Object} materialParams
 */
export const createSphereWithTextures = (radius, materialParams) => {
  const geometry = new THREE.SphereGeometry(radius, 20, 20);
  const material = new THREE.MeshPhongMaterial(materialParams);
  return new THREE.Mesh(geometry, material);
};
