import "./style.css";
import * as THREE from "three";

//SET UP ENVIROMENT
const nearDist = 0.1;
const farDist = 10000;

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  nearDist,
  farDist
);
camera.position.x = farDist * -2;
camera.position.z = 500;

const renderer = new THREE.WebGLRenderer({ antialias: true });

renderer.setClearColor("#222"); // Backgrond Color
renderer.setPixelRatio(window.devicePixelRatio); // For HiDPI devices to prevent bluring output canvas
renderer.setSize(window.innerWidth, window.innerHeight);
document.querySelector("#canvas-wrapper").appendChild(renderer.domElement);

// CREATE CUBE
const cubeSize = 100;
const geometry = new THREE.BoxBufferGeometry(cubeSize, cubeSize, cubeSize);
const material = new THREE.MeshNormalMaterial();
const group = new THREE.Group();
for (let i = 0; i < 100; i++) {
  const mesh = new THREE.Mesh(geometry, material);
  const dist = farDist / 3;
  const distDouble = dist * 2;
  const tau = 2 * Math.PI; // One turn

  mesh.position.x = Math.random() * distDouble - dist;
  mesh.position.y = Math.random() * distDouble - dist;
  mesh.position.z = Math.random() * distDouble - dist;
  mesh.rotation.x = Math.random() * tau;
  mesh.rotation.y = Math.random() * tau;
  mesh.rotation.z = Math.random() * tau;

  // Manually control when 3D transformations recalculation occurs for better performance
  mesh.matrixAutoUpdate = false;
  mesh.updateMatrix();

  group.add(mesh);
}
scene.add(group);

//CREATE DONUT

const donutGeometry = new THREE.TorusBufferGeometry(50, 30, 20, 45);
const material2 = new THREE.MeshNormalMaterial();
const group2 = new THREE.Group();
for (let i = 0; i < 100; i++) {
  const mesh2 = new THREE.Mesh(donutGeometry, material2);
  const dist2 = farDist / 3;
  const distDouble2 = dist2 * 2;
  const tau2 = 2 * Math.PI; // One turn

  mesh2.position.x = Math.random() * distDouble2 - dist2;
  mesh2.position.y = Math.random() * distDouble2 - dist2;
  mesh2.position.z = Math.random() * distDouble2 - dist2;
  mesh2.rotation.x = Math.random() * tau2;
  mesh2.rotation.y = Math.random() * tau2;
  mesh2.rotation.z = Math.random() * tau2;

  // Manually control when 3D transformations recalculation occurs for better performance
  mesh2.matrixAutoUpdate = false;
  mesh2.updateMatrix();

  group2.add(mesh2);
}
scene.add(group2);

// CREATE TYPOGRAPHY
const loader = new THREE.FontLoader();
const textMesh = new THREE.Mesh();
const createTypo = (font) => {
  const word = "kryonics";
  const typoProperties = {
    font: font,
    size: cubeSize * 1.2,
    height: cubeSize / 2,
    curveSegments: 15,
    bevelEnabled: true,
    bevelThickness: 15,
    bevelSize: 6,
    bevelOffset: 1,
    bevelSegments: 10,
  };

  const text = new THREE.TextGeometry(word, typoProperties);
  textMesh.geometry = text;
  textMesh.material = material;
  textMesh.position.x = cubeSize * -3;
  textMesh.position.z = cubeSize * -1;
  scene.add(textMesh);
};

loader.load("/fonts/helvetiker_regular.typeface.json", createTypo);

// CREATE TYPOGRAPHY2
const loader2 = new THREE.FontLoader();
const textMesh2 = new THREE.Mesh();
const createTypo2 = (font) => {
  const word2 = "front-end dev";
  const typoProperties2 = {
    font: font,
    size: cubeSize * 1.2,
    height: cubeSize / 2,
    curveSegments: 15,
    bevelEnabled: true,
    bevelThickness: 15,
    bevelSize: 6,
    bevelOffset: 1,
    bevelSegments: 10,
  };

  const text2 = new THREE.TextGeometry(word2, typoProperties2);
  textMesh2.geometry = text2;
  textMesh2.material = material;
  textMesh2.position.x = cubeSize * -5;
  textMesh.position.y = cubeSize * 1.5;
  textMesh2.position.z = cubeSize * -1;
  scene.add(textMesh2);
};

loader.load("/fonts/helvetiker_regular.typeface.json", createTypo);
loader2.load("/fonts/helvetiker_regular.typeface.json", createTypo2);

// MOUSE EFFECT
let mouseX = 0;
let mouseY = 0;
const mouseFX = {
  windowHalfX: window.innerWidth / 2,
  windowHalfY: window.innerHeight / 2,
  coordinates: function (coordX, coordY) {
    mouseX = (coordX - mouseFX.windowHalfX) * 5;
    mouseY = (coordY - mouseFX.windowHalfY) * 5;
  },
  onMouseMove: function (e) {
    mouseFX.coordinates(e.clientX, e.clientY);
  },
  onTouchMove: function (e) {
    mouseFX.coordinates(
      e.changedTouches[0].clientX,
      e.changedTouches[0].clientY
    );
  },
};
document.addEventListener("mousemove", mouseFX.onMouseMove, false);
document.addEventListener("touchmove", mouseFX.onTouchMove, false);

// RENDER 3D GRAPHIC
const render = () => {
  requestAnimationFrame(render);

  // Camera animation
  // Works with onMouseMove and onTouchMove functions
  camera.position.x += (mouseX - camera.position.x) * 0.05;
  camera.position.y += (mouseY * -1 - camera.position.y) * 0.05;
  camera.lookAt(scene.position); // Rotates the object to face a point in world space

  const t = Date.now() * 0.001;
  const rx = Math.sin(t * 0.7) * 0.5;
  const ry = Math.sin(t * 0.3) * 0.5;
  const rz = Math.sin(t * 0.2) * 0.5;

  //BOX GROUP
  group.rotation.x = rx;
  group.rotation.y = ry;
  group.rotation.z = rz;

  //DONUT GROUP
  group2.rotation.x = rx;
  group2.rotation.y = ry;
  group2.rotation.z = rz;

  textMesh.rotation.x = rx;

  textMesh2.rotation.x = rx;

  renderer.render(scene, camera);
};
render();
