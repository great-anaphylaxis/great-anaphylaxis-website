import * as THREE from "/src/js/three.js";

let canvas = document.getElementById("canvas");
let age = document.getElementById("age");
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


let topbar = document.querySelector(".topbar");
let hideOnScroll = document.getElementById("scrolldown-hint");
let data = document.getElementById("data");

function start() {
    if (compareData("name", "project")) {
        createStarField(0, 1);
    }
    else {
        createStarField(0, 100);
    }

    render();

    setTimeout(() => {
        window.scrollTo(0, 0);
    }, 10);

    //

    putAge();
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

        if (pastScrollPercent > 0) {
            topbar.style.animation = "0.5s ease 0s 1 normal forwards running hide-topbar";

            if (hideOnScroll != undefined) {
                hideOnScroll.style.animation = "0.5s linear 0s 1 normal forwards running hide-onscroll-anim";
                hideOnScroll = undefined;
            }
        }
    }

    else if (scrollPercent < pastScrollPercent) {
        camera.position.z += (1 * (scrollDelta * 1));

        if (pastScrollPercent > 0) {
            topbar.style.animation = "0.5s ease 0s 1 normal forwards running show-topbar";
        }
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
    let zStartPos = zStart - 40;
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

function compareData(data_property, data_value) {
    if (data != undefined && data.dataset[data_property] != undefined) {
        if (data.dataset[data_property] == data_value) {
            return true;
        }
    }
    return false;
}

function putAge() {
    if (age != undefined) {
        let dob = new Date("01/12/2009");
        let month_diff = Date.now() - dob.getTime();  
        let age_dt = new Date(month_diff);
        let year = age_dt.getUTCFullYear();
        let ageYear = Math.abs(year - 1970);
    
        age.innerText = ageYear;
    }
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