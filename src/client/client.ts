import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import  { GUI } from 'dat.gui';
// import  Stats from 'three/examples/jsm/libs/stats.module';

const scene = new THREE.Scene()
// scene.background = new THREE.Color(0x448800)

const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
)
camera.position.z = 2

const renderer = new THREE.WebGLRenderer()
renderer.setSize(window.innerWidth, window.innerHeight)
document.body.appendChild(renderer.domElement)

new OrbitControls(camera, renderer.domElement)

const geometry = new THREE.SphereGeometry(1, 75, 75)
// const geometry = new THREE.TorusKnotGeometry(0.5, 0.1, 120, 40)
// const material = new THREE.MeshBasicMaterial({
//     color: 0x00ff00,
//     wireframe: true,

// })

const material = new THREE.ShaderMaterial({
    uniforms: {
        color1: {
            value: new THREE.Color("red")
        },
        color2: {
            value: new THREE.Color("blue")
        }
    },
    vertexShader: `
            varying vec2 vUv;

            void main() {
            vUv = uv;
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
            }
        `,
    fragmentShader: `
            uniform vec3 color1;
            uniform vec3 color2;

            varying vec2 vUv;

            void main() {

            gl_FragColor = vec4(mix(color1, color2, vUv.y), 1.0);
            }
        `,
    wireframe: true
});

const sphere = new THREE.Mesh(geometry, material)
scene.add(sphere)

window.addEventListener('resize', onWindowResize, false)
function onWindowResize() {
    camera.aspect = window.innerWidth / window.innerHeight
    camera.updateProjectionMatrix()
    renderer.setSize(window.innerWidth, window.innerHeight)
    render()
}


const gui = new GUI()
const sphereFolder = gui.addFolder('Sphere')
const sphereRotationFolder = sphereFolder.addFolder('Rotation')
sphereRotationFolder.add(sphere.rotation, 'x', 0, Math.PI * 2)
sphereRotationFolder.add(sphere.rotation, 'y', 0, Math.PI * 2)
sphereRotationFolder.add(sphere.rotation, 'z', 0, Math.PI * 2)

const spherePositionFolder = sphereFolder.addFolder('Position')
spherePositionFolder.add(sphere.position, 'x', -10, 10)
spherePositionFolder.add(sphere.position, 'y', -10, 10)
spherePositionFolder.add(sphere.position, 'z', -10, 10)

const sphereScaleFolder = sphereFolder.addFolder('Scale')
sphereScaleFolder.add(sphere.scale, 'x', 0, 5)
sphereScaleFolder.add(sphere.scale, 'y', 0, 5)
sphereScaleFolder.add(sphere.scale, 'z', 0, 5)

const cameraFolder = gui.addFolder('Camera')
cameraFolder.add(camera.position, 'z', 0, 20)

function animate() {
    requestAnimationFrame(animate)

    // sphere.rotation.x += 0.01
    sphere.rotation.y += 0.005

    render()
}

function render() {
    renderer.render(scene, camera)
}

animate()