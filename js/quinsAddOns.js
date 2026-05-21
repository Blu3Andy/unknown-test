import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { RectAreaLightHelper } from 'three/addons/helpers/RectAreaLightHelper.js';
import { RectAreaLightUniformsLib } from 'three/addons/lights/RectAreaLightUniformsLib.js';



const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.outputColorSpace = THREE.SRGBColorSpace;

renderer.setSize(160*5.5, 90*5.5);
renderer.setClearColor(0xf9fafb, 1);
renderer.setPixelRatio(window.devicePixelRatio);

renderer.shadowMap.enabled = false;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

document.body.appendChild(renderer.domElement);

const scene = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(50, 16/9, 1, 1000);
camera.position.set(2, 3, 5);
camera.far = 0;
camera.near = 0.000000000001;

const controls = new OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enablePan = false;
controls.enableZoom = false;
controls.minDistance = 5;
controls.maxDistance = 10;
controls.minPolarAngle = 0.5;
controls.maxPolarAngle = 1.5;
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


const INTENSITY_NITS = 200;
const LIGHT_WIDTH  = 1;  
const LIGHT_HEIGHT = 1;

scene.add( new THREE.AmbientLight(0xFFFFFF))

const areaLight1 = new THREE.RectAreaLight(0xffffff, 220, LIGHT_WIDTH, LIGHT_HEIGHT);
areaLight1.position.set(6, 5, 3);
areaLight1.lookAt(0.25, 2, 0.25); 
scene.add(areaLight1);

const areaLight2 = new THREE.RectAreaLight(0xffffff, 200, LIGHT_WIDTH, LIGHT_HEIGHT);
areaLight2.position.set(2, 5, 6);
areaLight2.lookAt(0.25, 1.8, 0.25);
scene.add(areaLight2);

const shadowLight = new THREE.DirectionalLight(0xffffff, 0);
shadowLight.position.set(4, 5, 4);
shadowLight.castShadow = true;
shadowLight.shadow.bias = -0.0001;
shadowLight.intensity = 0.5; 
scene.add(shadowLight);

const spotLight1 = new THREE.SpotLight(0xffffff, 100, 100, 1, 1);
spotLight1.position.set(-6, 5, 3);
spotLight1.castShadow = true;
// spotLight1.shadow.bias = -0.0001;
spotLight1.target.position.set(0.25, 2, 0.25);
scene.add(spotLight1);

const spotLight2 = new THREE.SpotLight(0xffffff, 100, 100, 1, 1);
spotLight2.position.set(6, 5, 3);
spotLight2.castShadow = true;
// spotLight2.shadow.bias = -0.0001;
spotLight2.target.position.set(0.25, 2, 0.25);
scene.add(spotLight2);

let mixer;
let clips;
let loader = null;
let currentModel = null;

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});


const clock = new THREE.Clock();

function renderObject(object, position = new THREE.Vector3(0, 0, 0))
{
 
  loader = new GLTFLoader().setPath('/models/addOns/');
  loader.load(object, (gltf) => {
    console.log('loading model');
    const mesh = gltf.scene;

    mesh.traverse((child) => {
      if (child.isMesh) {
        child.castShadow = true;
        child.receiveShadow = true;
      }
    });
    console.log(mesh.position);
    mesh.position.set(position.x, position.y, position.z);
    currentModel = mesh;
    scene.add(mesh);

    mixer = new THREE.AnimationMixer(mesh);
    clips = gltf.animations;

    document.getElementById('progress-container').style.display = 'none';
  }, (xhr) => {
    console.log(`loading ${xhr.loaded / xhr.total * 100}%`);
  }, (error) => {
    console.error(error);
  });
}

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

export function showModel1()
{
  scene.remove(currentModel);
  renderObject('klotzSchublade.gltf', new THREE.Vector3(0, -0.5, 0));
}

export function showModel2()
{
  scene.remove(currentModel);
  renderObject('MagnetHalterL.gltf');
}

export function showModel3()
{
  scene.remove(currentModel);
  renderObject('MagnetHalterI.gltf');
}

export function showModel4()
{
  scene.remove(currentModel);
  renderObject('HalterTHTFokus.gltf');
}

export function showModel5()
{
  scene.remove(currentModel);
  renderObject('HalterTHTFokusThin.gltf');
}

export function showModel6()
{
  scene.remove(currentModel);
  renderObject('HalterTHTFokusAngle.gltf');
}

export function showModel7()
{
  scene.remove(currentModel);
  renderObject('MagnetMitteUnterstützung.gltf');
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