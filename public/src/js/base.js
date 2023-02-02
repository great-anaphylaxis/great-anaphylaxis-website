import * as THREE from "/src/js/three.js";

let canvas = document.getElementById("canvas");
let renderer = new THREE.WebGLRenderer({canvas});
let camera = new THREE.PerspectiveCamera(75, 2, 0.1, 50);
let scene = new THREE.Scene();

let material = {
    star: new THREE.MeshBasicMaterial({color: 0xffffff})
};

let geometry = {
    star: new THREE.SphereGeometry( 0.05, 4, 4 )
};

let pastScrollPercent = 0;
let scrollPercent = getScrollPercent();

function start() {

    createStarField(0, 100);

    render();

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);
}

function onresize() {
    camera.aspect = (window.innerWidth * 1) / (window.innerHeight * 1);
    camera.updateProjectionMatrix();
    renderer.setSize((window.innerWidth * 1), (window.innerHeight * 1));
    renderer.render(scene, camera);
}

function onscroll() {
    scrollPercent = getScrollPercent();

    let scrollDelta = scrollPercent - pastScrollPercent;

    if (scrollDelta == 0) {

    }

    else if (scrollPercent > pastScrollPercent) {
        camera.position.z += (1 * (scrollDelta * 1));
    }

    else if (scrollPercent < pastScrollPercent) {
        camera.position.z += (1 * (scrollDelta * 1));
    }

    pastScrollPercent = scrollPercent;

    render();
    
}

///

function render() {
    renderer.render(scene, camera);
}

function getScrollPercent() {
    return ((document.documentElement.scrollTop || document.body.scrollTop) / ((document.documentElement.scrollHeight || document.body.scrollHeight) - document.documentElement.clientHeight)) * 100;
}

function createStar(x, y, z) {
    let star = new THREE.Mesh(geometry.star, material.star);
    star.position.x = x;
    star.position.y = y;
    star.position.z = z;

    scene.add(star);
}

function createStarField(zStart, zEnd) {
    let zStartPos = zStart - 20;
    let zEndPos = zEnd + 40;

    for (let i = 0; i < 100; i++) {
        for (let j = 0; j < 5; j++) {
            createStar(random(-25, 25), random(-25, 25), zStartPos);
        }
        zStartPos += lerp(zStart, zEndPos, 0.01);
    }
}

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function lerp(start, end, amount){
    return (1 - amount) * start + amount * end;
}

///

document.body.onscroll = (e) => {
    onscroll();
};

document.body.onresize = (e) => {
    onresize();
};

document.body.onload = (e) => {
    start();
    onresize();
};