// 导入Three.js库中的必要模块
import * as THREE from 'three'
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js'
import { DRACOLoader } from 'three/addons/loaders/DRACOLoader.js'
import { add } from 'three/examples/jsm/libs/tween.module.js'

// 创建一个新的场景
const scene = new THREE.Scene()

// 创建一个新的透视相机
const camera = new THREE.PerspectiveCamera(
  45, // 视角
  window.innerWidth / window.innerHeight, // 宽高比
  0.1, // 近裁剪面
  1000 // 远裁剪面
)

// 创建一个新的WebGL渲染器
const renderer = new THREE.WebGLRenderer()

// 设置渲染器的大小与窗口大小相同
renderer.setSize(window.innerWidth / 2, window.innerHeight/ 2)

// 将渲染器的DOM元素添加到文档体中
document.body.appendChild(renderer.domElement)

// 创建一个新的长方体几何体，尺寸为1x1x1
const geometry = new THREE.BoxGeometry(1, 1, 1)

// 创建一个新的基本材质，颜色为绿色
const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })

// 创建一个新的网格对象，使用长方体几何体和材质
const cube = new THREE.Mesh(geometry, material)

// 将网格对象添加到场景中
scene.add(cube)

// 将相机的位置设置为(0, 0, 5)
camera.position.z = 5

// 使相机看向原点(0, 0, 0)
camera.lookAt(0, 0, 0)

// 定义动画函数
const animate = () => {
  // 请求下一帧动画
  requestAnimationFrame(animate)

  // 旋转立方体沿x和y轴
  cube.rotation.x += 0.01
  cube.rotation.y += 0.01

  // 使用相机和渲染器渲染场景
  renderer.render(scene, camera)
}

// 调用动画函数开始动画循环
animate()
