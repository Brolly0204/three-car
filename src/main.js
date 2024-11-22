// 导入Three.js库中的必要模块
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { OrbitControls } from 'three/addons/controls/OrbitControls.js'
import { RGBELoader } from 'three/addons/loaders/RGBELoader.js'
import gdl from './assets/ferrari.glb?url'
console.log(gdl)

// 创建一个新的场景
const scene = new THREE.Scene()

scene.background = new THREE.Color(0x333333)
// 创建一个新的透视相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近裁剪面
  100 // 远裁剪面
)

const rgbUrl = await import('./assets/venice_sunset_1k.hdr?url')
console.log(rgbUrl)
scene.environment = new RGBELoader().load(rgbUrl.default)
scene.environment.mapping = THREE.EquirectangularReflectionMapping

const bodyMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xff0000,
  metalness: 1.0,
  roughness: 0.5,
  clearcoat: 1.0,
  clearcoatRoughness: 0.03,
  sheen: 0.5,
})

// 玻璃材质设置
const glassMaterial = new THREE.MeshPhysicalMaterial({
  color: 0xffffff,
  metalness: 0.25,
  roughness: 0,
  transmission: 1.0,
})

// 轮辋‌=轮圈 轮辐材质设置
const detailsMaterial = new THREE.MeshStandardMaterial({
  color: 0xffffff,
  metalness: 1.0,
  roughness: 0.5,
})

camera.position.set(1, 1, 10)
// 创建一个新的WebGL渲染器
const renderer = new THREE.WebGLRenderer({
  antialias: true,
})

renderer.setSize(window.innerWidth, window.innerHeight)
const app = document.querySelector('#app')
app.appendChild(renderer.domElement)

const colorPicker = document.querySelector('#colorPicker')
const colorPicker2 = document.querySelector('#colorPicker2')
const colorPicker3 = document.querySelector('#colorPicker3')
colorPicker.addEventListener('input', (e) => {
  bodyMaterial.color.set(e.target.value)
})
colorPicker2.addEventListener('input', (e) => {
  glassMaterial.color.set(e.target.value)
})
colorPicker3.addEventListener('input', (e) => {
  detailsMaterial.color.set(e.target.value)
})

const controllers = new OrbitControls(camera, renderer.domElement)
controllers.enableDamping = true
controllers.maxDistance = 9
controllers.target.set(0, 0.5, 0)
renderer.setAnimationLoop(render)

const grid = new THREE.GridHelper(20, 40, 0xffffff, 0xffffff)
grid.material.opacity = 0.25
grid.material.depthWrite = false
grid.material.transparent = true
scene.add(grid)
// 设置渲染器的大小与窗口大小相同
controllers.update()

// 将渲染器的DOM元素添加到文档体中

const dracerLoader = new DRACOLoader()
dracerLoader.setDecoderPath('/decoder/')

const wheels = []
const loader = new GLTFLoader()
const shadowPng = await import('./assets/ferrari_ao.png?url')
const shadow = new THREE.TextureLoader().load(shadowPng.default)
loader.setDRACOLoader(dracerLoader)
loader.load(
  gdl,
  (gltf) => {
    console.log(gltf)
    const car = gltf.scene.children[0]
    car.getObjectByName('body').material = bodyMaterial
    car.getObjectByName('rim_fl').material = detailsMaterial
    car.getObjectByName('rim_fr').material = detailsMaterial
    car.getObjectByName('rim_rl').material = detailsMaterial
    car.getObjectByName('rim_rr').material = detailsMaterial
    car.getObjectByName('glass').material = glassMaterial
    wheels.push(
      car.getObjectByName('wheel_fl'),
      car.getObjectByName('wheel_fr'),
      car.getObjectByName('wheel_rl'),
      car.getObjectByName('wheel_rr')
    )
    const mesh = new THREE.Mesh(
      new THREE.PlaneGeometry(0.655 * 4, 1.3 * 4),
      new THREE.MeshBasicMaterial({
        map: shadow,
        blending: THREE.MultiplyBlending,
      })
    )
    mesh.rotation.x = -Math.PI / 2
    mesh.renderOrder = 2
    car.add(mesh)
    scene.add(car)
  },
  undefined,
  (err) => {
    console.log(err)
  }
)

function render() {
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix()
  // 渲染场景和相机
  controllers.update()

  const time = performance.now() / 1000
  grid.position.z = time % 1
  wheels.forEach((wheel) => {
    wheel.rotation.x = -time * Math.PI * 2
  })
  renderer.render(scene, camera)
}
