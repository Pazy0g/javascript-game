const canvas = document.querySelector("canvas");
const c = canvas.getContext("2d");

// * Setting default values for canvas properties
canvas.width = 1024;
canvas.height = 576;

// filling the canvas with black background
c.fillRect(0, 0, canvas.width, canvas.height);

//* Adding gravity to prevent models from falling off the screen
const gravity = 0.7;
const background = new Sprite({
  position: {
    x: 0,
    y: 0,
  },
  imageSrc: 'assets/background.png'

})
//? Might add a custom property to prevent the model from jumping off the screen

//! Creating model objects for both players and enemies
//! Creating player object with default values for {Velocity, Position and offset}
const player = new Fighter({
  position: {
    x: 0,
    y: 0,
  },
  velocity: {
    x: 0,
    y: 10,
  },
  offset: {
    x: 0,
    y: 0,
  },
});

//! Creating enemy objects with default values for {Velocity and Position}
const enemy = new Fighter({
  position: {
    x: 400,
    y: 100,
  },
  velocity: {
    x: 0,
    y: 0,
  },
  color: "blue",
  offset: {
    x: -50,
    y: 0,
  },
});

enemy.draw();

//! Key pressed object
//* Allowing the use of the keyboard to control models
const keys = {
  q: {
    pressed: false,
  },
  d: {
    pressed: false,
  },
  z: {
    pressed: false,
  },
  ArrowRight: {
    pressed: false,
  },
  ArrowLeft: {
    pressed: false,
  },
};

//* Adding a function to detect the collisions between the player and the enemies
// this makes the code more readable instead of writing it into the if statement within the animate loop function
function rectangularCollision({ rectangle1, rectangle2 }) {
  return (
    rectangle1.attackBox.position.x + rectangle1.attackBox.width >=
    rectangle2.position.x &&
    rectangle1.attackBox.position.x <=
    rectangle2.position.x + rectangle2.width &&
    rectangle1.attackBox.position.y + rectangle1.attackBox.height >=
    rectangle2.position.y &&
    rectangle1.attackBox.position.y <= rectangle2.position.y + rectangle2.height
  );
}

function determineWinner({ player, enemy, timerId }) {
  clearTimeout(timerId);
  document.querySelector("#displayText").style.display = "flex";

  if (player.health === enemy.health) {
    document.querySelector("#displayText").innerHTML = "Tie";
  } else if (player.health > enemy.health) {
    document.querySelector("#displayText").innerHTML = "Joueur 1 Gagne!";
  } else if (player.health < enemy.health) {
    document.querySelector("#displayText").innerHTML = "Joueur 2 Gagne!";
  }
}

let timer = 60;
let timerId;
function decreaseTimer() {
  if (timer > 0) {
    timerId = setTimeout(decreaseTimer, 1000);
    timer--;
    document.querySelector("#timer").innerHTML = timer;
  }

  if (timer === 0) {
    determineWinner({ player, enemy, timerId });
  }
}

decreaseTimer();

//! Function for animating both players and enemies
function animate() {
  window.requestAnimationFrame(animate);
  c.fillStyle = "black";
  c.fillRect(0, 0, canvas.width, canvas.height);
  background.update();
  player.update();
  enemy.update();

  player.velocity.x = 0;
  enemy.velocity.x = 0;

  //* Player movement
  if (keys.q.pressed && player.lastKey === "q") {
    player.velocity.x = -5;
  } else if (keys.d.pressed && player.lastKey === "d") {
    player.velocity.x = 5;
  }

  //* Enemy movement
  if (keys.ArrowLeft.pressed && enemy.lastKey === "ArrowLeft") {
    enemy.velocity.x = -5;
  } else if (keys.ArrowRight.pressed && enemy.lastKey === "ArrowRight") {
    enemy.velocity.x = 5;
  }

  // Detect for collisions
  if (
    rectangularCollision({
      rectangle1: player,
      rectangle2: enemy,
    }) &&
    player.isAttacking
  ) {
    player.isAttacking = false;
    enemy.health -= 20;
    document.querySelector("#enemyHealth").style.width = enemy.health + "%";
  }

  if (
    rectangularCollision({
      rectangle1: enemy,
      rectangle2: player,
    }) &&
    enemy.isAttacking
  ) {
    enemy.isAttacking = false;
    player.health -= 20;
    document.querySelector("#playerHealth").style.width = player.health + "%";
  }

  // end game based on health
  if (enemy.health <= 0 || player.health <= 0) {
    determineWinner({ player, enemy, timerId });
  }
}
animate();

// ! Making player and enemies capable of movement using [addEventListener] functions on key pressed and release

//* Pressed keys
window.addEventListener("keydown", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = true;
      player.lastKey = "d";
      break;

    case "q":
      keys.q.pressed = true;
      player.lastKey = "q";
      break;

    case "z":
      player.velocity.y = -20;
      break;

    case " ":
      player.attack();

      break;

    //Enemy keyDown
    case "ArrowRight":
      keys.ArrowRight.pressed = true;
      enemy.lastKey = "ArrowRight";
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = true;
      enemy.lastKey = "ArrowLeft";
      break;

    case "ArrowUp":
      enemy.velocity.y = -20;
      break;

    case "ArrowDown":
      enemy.attack();
      break;
  }
});

//* Released keys
window.addEventListener("keyup", (event) => {
  switch (event.key) {
    case "d":
      keys.d.pressed = false;
      break;

    case "q":
      keys.q.pressed = false;
      break;
  }

  // enemy keys
  switch (event.key) {
    case "ArrowRight":
      keys.ArrowRight.pressed = false;
      break;

    case "ArrowLeft":
      keys.ArrowLeft.pressed = false;
      break;

    case "ArrowDown":
      enemy.isAttacking = false;
      break;
  }
});
