import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(1340, 720);
renderer.setClearColor(0xFFFFFF);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000);
camera.position.set(2, 2, 4);
camera.far = 0;
camera.near = 0.00000001;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.minDistance = 2;
controls.maxDistance = 3;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
controls.autoRotate = true;
controls.autoRotateSpeed = 1.0;
controls.target = new THREE.Vector3(0, 1, 0);
controls.update();

controls.addEventListener('start', () => {
  controls.autoRotate = false;
  autoRotate = false;
});

const groundGeometry = new THREE.PlaneGeometry(20, 20, 32, 32);
groundGeometry.rotateX(-Math.PI / 2);
const groundMaterial = new THREE.MeshStandardMaterial({
  color: 0xFFFFFF,
  side: THREE.DoubleSide
});


scene.add( new THREE.AmbientLight(0xFFFFFF))

const spotLight = new THREE.SpotLight(0xffffff, 3000, 100, 1, 1);
spotLight.position.set(0, 25, 10);
spotLight.castShadow = true;
spotLight.shadow.bias = -0.0001;
scene.add(spotLight);


let mixer;
let clips;


const loader = new GLTFLoader().setPath('../../models/');
loader.load('QuinsProductModel.gltf', (gltf) => {
  console.log('loading model');
  const mesh = gltf.scene;

  mesh.traverse((child) => {
    if (child.isMesh) {
      child.castShadow = false;
      child.receiveShadow = false;
    }
  });

  mesh.position.set(0, 0.14, 0);
  scene.add(mesh);

  mixer = new THREE.AnimationMixer(mesh);
  clips = gltf.animations;

  document.getElementById('progress-container').style.display = 'none';
}, (xhr) => {
  console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
}, (error) => {
  console.error(error);
});



window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


const clock = new THREE.Clock();

function animate() 
{
  requestAnimationFrame(animate);
  controls.update();

  if (mixer) 
  {
    mixer.update(clock.getDelta());
  }
  renderer.render(scene, camera);
}

export function playGeneralAnimation()
{
  playAnimation(getAnimation('InnererKastenTilt'));
}

export function stopAnimation()
{
  playAnimation(getAnimation('Idle'));
}

export function upAndDown()
{
  playAnimation(getAnimation('UpAndDown'))
}

export function armVorschau()
{
  playAnimation(getAnimation('ArmVorschau'))
}

function getAnimation(name)
{
  const clip = THREE.AnimationClip.findByName(clips, name);
  return mixer.clipAction(clip);
}

let current;
let autoRotate = true;
let hasInteracted = false;



function playAnimation(action) {
  if (current == null) 
  {
    action.play();
  } 
  else 
  {
    action.reset();
    action.play();
    
    current.crossFadeTo(action, 2);
  }
  
  console.log('Previous:', current, 'New:', action);
  current = action;
}

const container = document.getElementById('threejs-container');
container.appendChild(renderer.domElement);

animate();