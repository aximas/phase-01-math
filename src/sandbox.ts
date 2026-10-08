import * as THREE from "three";
import { OrbitControls } from "three/addons/controls/OrbitControls.js";

export type FrameCallback = (dt: number, elapsed: number) => void;

export function createSandbox() {
  const canvas = document.querySelector<HTMLCanvasElement>("#app");
  if (!canvas) throw new Error("Canvas #app not found");

  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(window.innerWidth, window.innerHeight, false);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("#0f1115");

  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    200
  );
  camera.position.set(6, 5, 8);

  const controls = new OrbitControls(camera, canvas);
  controls.enableDamping = true;

  // Оси: X — красная, Y — зелёная, Z — синяя. Сетка 10×10 на плоскости XZ.
  scene.add(new THREE.AxesHelper(3));
  scene.add(new THREE.GridHelper(10, 10, "#444", "#222"));

  scene.add(new THREE.AmbientLight("#ffffff", 0.5));
  const sun = new THREE.DirectionalLight("#ffffff", 2);
  sun.position.set(3, 6, 4);
  scene.add(sun);

  const callbacks: FrameCallback[] = [];
  const timer = new THREE.Timer();
  timer.connect(document);

  window.addEventListener("resize", () => {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight, false);
  });

  renderer.setAnimationLoop((t) => {
    timer.update(t);
    const dt = timer.getDelta();
    const elapsed = timer.getElapsed();
    for (const cb of callbacks) cb(dt, elapsed);
    controls.update(dt);
    renderer.render(scene, camera);
  });

  return {
    scene,
    camera,
    renderer,
    controls,
    onFrame: (cb: FrameCallback) => callbacks.push(cb),
  };
}

/** Стрелка из точки `origin` вдоль вектора `vec` (длина стрелки = длина вектора). */
export function arrow(
  origin: THREE.Vector3,
  vec: THREE.Vector3,
  color: THREE.ColorRepresentation
) {
  const len = vec.length();
  const dir =
    len > 0 ? vec.clone().divideScalar(len) : new THREE.Vector3(1, 0, 0);
  return new THREE.ArrowHelper(dir, origin, len, color, 0.25, 0.15);
}

const _dir = new THREE.Vector3(); // временный вектор, переиспользуется каждый кадр

/** Обновить уже созданную стрелку новыми данными (без аллокаций). */
export function updateArrow(
  a: THREE.ArrowHelper,
  origin: THREE.Vector3,
  vec: THREE.Vector3
) {
  const len = vec.length();
  a.position.copy(origin);
  if (len > 1e-6) a.setDirection(_dir.copy(vec).divideScalar(len));
  a.setLength(Math.max(len, 1e-3), 0.25, 0.15);
}

export function ball(color: THREE.ColorRepresentation, radius = 0.15) {
  return new THREE.Mesh(
    new THREE.SphereGeometry(radius, 24, 16),
    new THREE.MeshStandardMaterial({ color })
  );
}
