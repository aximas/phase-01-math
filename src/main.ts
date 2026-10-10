import * as THREE from "three";
import { createSandbox, arrow, ball, updateArrow } from "./sandbox";

const { scene, onFrame } = createSandbox();

const origin = new THREE.Vector3();

const player = new THREE.Vector3(-3, 0, 2);
const enemy = new THREE.Vector3(2, 0, -1);
const playerToEnemy = origin.clone().subVectors(enemy, player);
const playerToEnemyNormalized = playerToEnemy.clone().normalize();

const playerBall = ball("#ff5555"); //red
playerBall.position.copy(player);
scene.add(playerBall);

const enemyBall = ball("#55ff88"); // green
enemyBall.position.copy(enemy);
scene.add(enemyBall);

const playerToEnemyArrow = arrow(player, playerToEnemy, "#fff");

const enemyToPlayer = origin.clone();

const ballSpeed = 1.5; // units per second
const distanceThreshold = 0.3; // units

onFrame((dt) => {
  enemyToPlayer.subVectors(playerBall.position, enemyBall.position);

  const enemyToPlayerSubLength = enemyToPlayer.length();
  const enemyToPlayerNormalized = enemyToPlayer.normalize();

  if (enemyToPlayerSubLength < distanceThreshold) return;

  enemyBall.position.addScaledVector(enemyToPlayerNormalized, dt * ballSpeed);
  playerToEnemy.add(enemyToPlayerNormalized.multiplyScalar(dt * ballSpeed));

  updateArrow(playerToEnemyArrow, player, playerToEnemy);
});

scene.add(playerToEnemyArrow);
scene.add(arrow(player, playerToEnemyNormalized, "#fae84a"));

console.log("from player to enemy length", playerToEnemy.length().toFixed(3));
console.log("playerToEnemyNormalized", playerToEnemyNormalized.length());
