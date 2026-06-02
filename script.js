const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 100,
    y: 100,
    width: 40,
    height: 40
};

const keys = {};
const gravity = .6;
let ground = canvas.height - 100;

player.vx = 0;
player.vy = 0;
player.grounded = false;
player.jumps = 2;

let platforms = [];
let spikes = [];
let flag = null;
let currentLevel = 0;
let tileSize = 40;
const levels = [
    [
        "--------------------------------",
        "--------------------------------",
        "--------------------------------",
        "----F---------------------------",
        "---###--------------------------",
        "--------------#-----------------",
        "--------------------------------",
        "--------------------------------",
        "--------------------------------",
        "--------------------------------",
        "----------------#---------------",
        "--------------------------------",
        "--------------------------------",
        "--------------------------------",
        "-p------------------------------",
    ],
    [
        "----------------------#---------",
        "----------------------#----##---",
        "----------------------#-----#---",
        "-------##########-----#-----#---",
        "-------#--------------##----#---",
        "------##------#-------#-----#---",
        "-------#---############-----#---",
        "-------#-------------#-----#----",
        "-------#----------#-------#-----",
        "#------#---------#----#####---##",
        "-------#---------#--------#-----",
        "------#######################---",
        "--------------------------#-----",
        "--------------------------#--###",
        "-p------------------------#--F--",
    ],
    [   "--------------------------------",
        "--------------------------------",
        "--------------------------------",
        "--------------------------------",
        "-------------------------------f",
        "-----------------------------###",
        "--------------------------------",
        "--------------------------------",
        "-----------#----------#---------",
        "--------------------------------",
        "--------------------------------",
        "-------#------------------------",
        "--------------------------------",
        "p-------------------------------",
        "###sssssssssssssssssssssssssssss",
    ]
]

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

window.addEventListener("keydown", (e) => {
    if ((e.key === "w" || e.key === "ArrowUp") && player.jumps > 0){
        player.vy = -12;
        player.jumps--;
    } 
});

window.addEventListener("resize", () => {
    canvas.width= window.innerWidth;
    canvas.height = window.innerHeight;
    loadLevel(currentLevel);
});

function draw() {
    //background
    ctx.fillStyle = "#00b7ff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    //ground
    ctx.fillStyle = "green";
    ctx.fillRect(
        0,
        ground,
        canvas.width,
        100
    );

    //platforms
    ctx.fillStyle = "black";
    for (const platform of platforms){
        ctx.fillRect(
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );
    }

    //spikes
    ctx.fillStyle = "red";
    for (const spike of spikes){
        ctx.fillRect(
            spike.x,
            spike.y,
            spike.width,
            spike.height
        );
    }

    //flag
    if(flag){
        ctx.fillStyle = "darkgreen";
        ctx.fillRect(
            flag.x,
            flag.y,
            flag.width,
            flag.height
        );
    }

    // player
    ctx.fillStyle = "white"
    ctx.fillRect(
        player.x,
        player.y,
        player.width,
        player.height
    );
}

function movement(){
    player.grounded = false;

    if (keys["a"] || keys["ArrowLeft"]) {
        player.x -= 5;
    }

    if (keys["d"] || keys["ArrowRight"]) {
        player.x += 5;
    }

    player.vy += gravity;
    player.y += player.vy;

    //platform collision
    for(const platform of platforms){
        if(
            player.x < platform.x + platform.width &&
            player.x + player.width > platform.x &&
            player.y < platform.y + platform.height &&
            player.y + player.height > platform.y
        ){
            const leftCollision = player.x + player.width - platform.x;
            const rightCollision = platform.x + platform.width - player.x;
            const topCollision = player.y + player.height - platform.y;
            const bottomCollision = platform.y + platform.height - player.y;
            const collision = Math.min(leftCollision, rightCollision, topCollision, bottomCollision);

            if(collision === topCollision){
                player.y = platform.y - player.height;
                player.vy = 0;
                player.grounded = true;
                player.jumps = 2;
            } else if (collision === bottomCollision){
                player.y = platform.y + platform.height;
                if(player.vy < 0){
                    player.vy = 0;
                }
            } else if (collision === leftCollision){
                player.x = platform.x - player.width;
            } else if (collision === rightCollision){
                player.x = platform.x + platform.width;
            }
        }
    }

    //spike collision
    for(const spike of spikes){
        if (
            player.x < spike.x + spike.width &&
            player.x + player.width > spike.x &&
            player.y < spike.y + spike.height &&
            player.y + player.height > spiky.y
        ){
            loadLevel(currentLevel);
        }
    }

    //flag collision
    if(
        flag && 
        player.x < flag.x + flag.width &&
        player.x + player.width > flag.x &&
        player.y < flag.y + flag.height &&
        player.y + player.height > flag.y
    ){
        currentLevel++;
        if(currentLevel >= levels.length){
            console.log("Game Completed")
        } else {
            console.log("Beat Level")
            loadLevel(currentLevel);
        }
    }

    //ground collision
    if(player.y + player.height > ground){
        player.y = ground - player.height;
        player.vy = 0;
        player.grounded = true;
        player.jumps = 2;
    }

    if (player.grounded){
        player.jumps = 2;
    }

    //screen collision
    if(player.x < 0){
        player.x = 0;
    }

    if(player.x + player.width > canvas.width){
        player.x = canvas.width - player.width;
    }
}

function loadLevel(index){
    const level = levels[index];
    const cols = level[0].length;
    const rows = level.length;
    tileSize = Math.min(canvas.width / cols, canvas.height / rows);
    ground = rows * tileSize;

    platforms = [];
    spikes = [];
    flag = null;

    for(let row = 0; row < level.length; row++){
        for(let col = 0; col < level[row].length; col++){

        const tile = level[row][col];

        if(tile === "#"){
            platforms.push({
                x: col * tileSize,
                y: row * tileSize,
                width: tileSize,
                height: tileSize
            });
        }

        if(tile === "s"){
            spikes.push({
                x: col * tileSize,
                y: row * tileSize,
                width: tileSize,
                height: tileSize
            });
        }

        if(tile === "p"){
            player.x = col * tileSize;
            player.y = row * tileSize;
            player.width = tileSize;
            player.height = tileSize;
            player.vy = 0;
        }

        if(tile === "F"){
            flag = {
                x: col * tileSize,
                y: row * tileSize,
                width: tileSize,
                height: tileSize
                };
            }
        }
    }
    player.grounded = false;
}

function animation(){
    movement();
    draw();
    requestAnimationFrame(animation);
}

loadLevel(currentLevel);
animation();