import * as THREE from "three";
import { createSandbox, arrow, ball, updateArrow } from "./sandbox";

const { scene } = createSandbox();

const origin = new THREE.Vector3(0, 0, 0);

const player = new THREE.Vector3(-3, 0, 2);
const enemy = new THREE.Vector3(2, 0, -1);
const playerToEnemy = origin.clone().subVectors(enemy, player);
const playerToEnemyNormalized = playerToEnemy.clone().normalize();

const playerBall = ball("#ff5555");
playerBall.position.copy(player);
scene.add(playerBall);

const enemyBall = ball("#55ff88");
enemyBall.position.copy(enemy);
scene.add(enemyBall);

scene.add(arrow(player, playerToEnemy, "#fff"));
scene.add(arrow(player, playerToEnemyNormalized, "#fae84a"));

updateArrow(arrow(player, playerToEnemy, "#fff"), player, enemy);

console.log("from player to enemy length", playerToEnemy.length().toFixed(3));
