import * as THREE from 'https://threejs.org/build/three.module.js';

const textures = {
  sun: { map: 'images/sunmap.jpg' },
  mercury: { map: 'images/mercurymap.jpg', bumpMap: 'images/mercurybump.jpg' },
  venus: { map: 'images/venusmap.jpg', bumpMap: 'images/venusbump.jpg' },
  earth: {
    map: 'images/2k_earth_daymap.jpg',
    normalMap: 'images/2k_earth_normal_map.jpg',
    specularMap: 'images/2k_earth_specular_map.jpg',
  },
  moon: { map: 'images/moonmap1k.jpg', bumpMap: 'images/moonbump1k.jpg' },
  mars: {
    map: 'images/mars_1k_color.jpg',
    normalMap: 'images/mars_1k_normal.jpg',
  },
  jupiter: { map: 'images/jupitermap.jpg' },
  saturn: { map: 'images/saturnmap.jpg' },
  uranus: { map: 'images/uranusmap.jpg' },
  neptune: { map: 'images/neptunemap.jpg' },
  pluto: { map: 'images/plutomap1k.jpg', bumpMap: 'images/plutobump1k.jpg' },
};

const loadTextures = async () =>
  Promise.all([
    new THREE.TextureLoader().loadAsync(textures.sun.map),
    new THREE.TextureLoader().loadAsync(textures.mercury.map),
    new THREE.TextureLoader().loadAsync(textures.mercury.bumpMap),
    new THREE.TextureLoader().loadAsync(textures.venus.map),
    new THREE.TextureLoader().loadAsync(textures.venus.bumpMap),
    new THREE.TextureLoader().loadAsync(textures.earth.map),
    new THREE.TextureLoader().loadAsync(textures.earth.normalMap),
    new THREE.TextureLoader().loadAsync(textures.earth.specularMap),
    new THREE.TextureLoader().loadAsync(textures.moon.map),
    new THREE.TextureLoader().loadAsync(textures.moon.bumpMap),
    new THREE.TextureLoader().loadAsync(textures.mars.map),
    new THREE.TextureLoader().loadAsync(textures.mars.normalMap),
    new THREE.TextureLoader().loadAsync(textures.jupiter.map),
    new THREE.TextureLoader().loadAsync(textures.saturn.map),
    new THREE.TextureLoader().loadAsync(textures.uranus.map),
    new THREE.TextureLoader().loadAsync(textures.neptune.map),
    new THREE.TextureLoader().loadAsync(textures.pluto.map),
    new THREE.TextureLoader().loadAsync(textures.pluto.bumpMap),
  ]).then(
    ([
      sunM,
      mercM,
      mercB,
      venM,
      venB,
      earM,
      earN,
      earS,
      moonM,
      moonB,
      marsM,
      marsN,
      jupM,
      satM,
      uraM,
      nepM,
      pluM,
      pluB,
    ]) => ({
      sun: { map: sunM },
      mercury: { map: mercM, bumpMap: mercB },
      venus: { map: venM, bumpMap: venB },
      earth: { map: earM, normalMap: earN, specularMap: earS },
      moon: { map: moonM, bumpMap: moonB },
      mars: { map: marsM, normalMap: marsN },
      jupiter: { map: jupM },
      saturn: { map: satM },
      uranus: { map: uraM },
      neptune: { map: nepM },
      pluto: { map: pluM, bumpMap: pluB },
    }),
  );

export default loadTextures;
