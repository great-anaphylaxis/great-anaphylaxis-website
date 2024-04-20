import * as THREE from "/src/js/three.js";

let canvas = document.getElementById("canvas");

const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
const renderer = new THREE.WebGLRenderer({
    canvas: canvas
});

renderer.setPixelRatio(window.devicePixelRatio);
renderer.setSize(window.innerWidth, window.innerHeight);
camera.position.setZ(30);

const geometry = new THREE.TorusGeometry(10, 3, 16, 100);
const material = new THREE.MeshBasicMaterial({color: "green", wireframe: true});
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

function loop() {
    requestAnimationFrame(loop);

    renderer.render(scene, camera);
}

loop()