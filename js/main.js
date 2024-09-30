import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import Stats from 'three/addons/libs/stats.module.js';
//import GUI from 'three/addons/libs/lil-gui.module.min.js';

const clock = new THREE.Clock();

window.addEventListener('resize', onResize, false);

const stats = Stats();
document.body.appendChild( stats.dom );

// Configuración básica del escenario
const scene = new THREE.Scene();

// configuración de la Camara Perspectiva
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.set( 0,0,3 );
camera.lookAt(scene.position);

// Configuraciones para el renderizado del escenario
const renderer = new THREE.WebGLRenderer( {antialias:true} );
//renderer.outputEncoding = THREE.sRGBEncoding;
//renderer.shadowMap.enabled = true;
//renderer.shadowMap.type = THREE.VSMShadowMap;
renderer.setSize( window.innerWidth, window.innerHeight );
renderer.setClearColor(0x000000);
document.body.appendChild( renderer.domElement );

const orbitControl = new OrbitControls(camera, renderer.domElement);
orbitControl.enableDamping = true;
const loader = new GLTFLoader();

var textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load('./images/therock.jpg');//Estas son texturas cargadas
const height = textureLoader.load('./images/Nubes.jpg');
const alpha = textureLoader.load('./images/alpha.jpg');


// Crear y agregar un plano
const planeGeometry = new THREE.PlaneGeometry(3,3,64,64);
const planeMaterial = new THREE.MeshStandardMaterial({
    color: 'grey',
    map: texture,
    displacementMap: height,
    displacementScale: 0.6,
    transparent: true,
    alphaMap: alpha,
    depthTest: false
});
const plane = new THREE.Mesh(planeGeometry, planeMaterial);
plane.rotation.x = 181;
scene.add(plane);

const spotLight = new THREE.SpotLight(0x00bfbf,250);
spotLight.position.set(.2,3,3);
scene.add(spotLight);

document.addEventListener('mousemove', animateTerrain);

let mouseY = 0;

function animateTerrain(event){
    mouseY = event.clientY;
}

animate();

function animate() {
    const elapsedTime = clock.getElapsedTime();
    requestAnimationFrame( animate );
    stats.update();
    orbitControl.update();

    plane.rotation.z = 0.5 * elapsedTime;
    plane.material.displacementScale = 1-mouseY * .0008;//como el eje es
    
    renderer.render( scene, camera );
}

function onResize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    
    renderer.setSize(window.innerWidth, window.innerHeight);
}