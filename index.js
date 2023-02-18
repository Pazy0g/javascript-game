const canvas = document.querySelector('canvas');
const c = canvas.getContext('2d');


// * Setting default values for canvas properties
canvas.width = 1024;
canvas.height = 576;

// filling the canvas with black background
c.fillRect(0,0, canvas.width, canvas.height);


//* Adding gravity to prevent models from falling off the screen
const gravity = 0.7

//? Might add a custom property to prevent the model from jumping off the screen

//! Creating model objects for both players and enemies
//* Mother class for models
class Sprite {
    constructor ({position, velocity}){
        this.position = position;
        this.velocity = velocity
        this.height = 150;
        this.lastKey
    }

    draw(){
        c.fillStyle = 'red';
        c.fillRect(this.position.x, this.position.y,50, this.height);
    }

    update(){
        this.draw();
        
        this.position.x += this.velocity.x;
        this.position.y += this.velocity.y;

        if(this.position.y + this.height + this.velocity.y >= canvas.height){
            this.velocity.y = 0
        } else this.velocity.y += gravity;
    }
}


//! Creating player object with default values for {Velocity and Position}
const player = new Sprite({
    position:{
    x: 0,
    y: 0
}, 
velocity: {
    x: 0,
    y: 10
}
});


//! Creating enemy objects with default values for {Velocity and Position}
const enemy = new Sprite({
    position:{
    
    x: 400,
    y: 100
    },
    velocity: {
        x: 0,
        y: 0
    }
});


enemy.draw();

//! Key pressed object
//* Allowing the use of the keyboard to control models
const keys = {
    q: {
        pressed: false
    },
    d: {
        pressed: false
    },
    z: {
        pressed: false
    },
    ArrowRight: {
        pressed: false
    },
    ArrowLeft: {
        pressed: false
    }
}




//! Function for animating both players and enemies
function animate (){
    window.requestAnimationFrame(animate);
    c.fillStyle = 'black';
    c.fillRect(0,0, canvas.width, canvas.height);
    player.update();
    enemy.update();

    player.velocity.x = 0;
    enemy.velocity.x = 0;



    //* Player movement
    if(keys.q.pressed && player.lastKey === 'q'){
        player.velocity.x = -5;
    } else if (keys.d.pressed && player.lastKey === 'd'){
        player.velocity.x = 5;
    }

     //* Enemy movement
     if(keys.ArrowLeft.pressed && enemy.lastKey === 'ArrowLeft'){
        enemy.velocity.x = -5;
    } else if (keys.ArrowRight.pressed && enemy.lastKey === 'ArrowRight'){
        enemy.velocity.x = 5;
    }
}
animate();


// ! Making player and enemies capable of movement using [addEventListener] functions on key pressed and release 

//* Pressed keys
window.addEventListener('keydown', (event) => {
    
    switch(event.key){
        case 'd':
            keys.d.pressed = true;
            player.lastKey = 'd'
        break;

        case 'q':
            keys.q.pressed = true;
            player.lastKey = 'q'
        break;

        case 'z':
            player.velocity.y = -20;
        break;


        case 'ArrowRight':
            keys.ArrowRight.pressed = true;
            enemy.lastKey = 'ArrowRight'
        break;

        case 'ArrowLeft':

            keys.ArrowLeft.pressed = true;
            enemy.lastKey = 'ArrowLeft'
        break;

        case 'ArrowUp':
            enemy.velocity.y = -20;
        break;
    }
    console.log(event.key);
})

//* Released keys
window.addEventListener('keyup', (event) => {
    switch(event.key){
        case 'd':
            keys.d.pressed = false;
        break;

        case 'q':
            keys.q.pressed = false;
        break;

    }


    // enemy keys
    switch(event.key){
        case 'ArrowRight':
            keys.ArrowRight.pressed = false;
        break;

        case 'ArrowLeft':
            keys.ArrowLeft.pressed = false;
        break;
    }
    console.log(event.key);
})

