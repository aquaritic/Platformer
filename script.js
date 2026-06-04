const canvas = document.getElementById("game");
const ctx = canvas.getContext("2d");

const platformImg = new Image();
platformImg.src = "platform.png";
const spikeImg = new Image();
spikeImg.src = "spike.png";
const invertSpikeImg = new Image();
invertSpikeImg.src = "invertSpike.png";
const gravImg = new Image();
gravImg.src = "grav.png";
const flagImg = new Image();
flagImg.src = "flag.png";

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

const player = {
    x: 100,
    y: 100,
    width: 40,
    height: 40
};

const keys = {};
let gravity = .6;

player.vx = 0;
player.vy = 0;
player.grounded = false;
player.jumps = 2;

let platforms = [];
let spikes = [];
let flag = null;
let gravitySwitch = null;
let spikeSwitch = null;
let currentLevel = 0;
let tileSize = 40;
let spikeDeath = true;
const levels = [
    [
        "--------------------------------#",
        "--------------------------------#",
        "--------------------------------#",
        "----F---------------------------#",
        "---###--------------------------#",
        "--------------------------------#",
        "--------------#-----------------#",
        "--------------------------------#",
        "--------------------------------#",
        "--------------------------------#",
        "----------------#---------------#",
        "--------------------------------#",
        "--------------------------------#",
        "p-------------------------------#",
        "#################################",
    ],
    [
        "----------------------#---------#",
        "----------------#-----#----##---#",
        "----------------#-----#-----#---#",
        "-------##########-###-#-----#---#",
        "-------#--------------##----#---#",
        "-------#------#-------#-----#---#",
        "------##---############-----#---#",
        "-------#-------------#-----#----#",
        "-------#----------#--------#----#",
        "#------#---------#----#####---###",
        "-------#---------#--------#-----#",
        "------#######################---#",
        "--------------------------#---###",
        "p-------------------------#----F#",
        "#################################",
    ],
    [   
        "---------------------------------",
        "---------------------------------",
        "---------------------------------",
        "---------------------------------",
        "------------------------------F--",
        "-----------------------------###-",
        "----------------------------#----",
        "---------------------------------",
        "-----------#---------#-----------",
        "---------------------------------",
        "---------------------------------",
        "-------#-------------------------",
        "---------------------------------",
        "p--------------------------------",
        "###ssssssssssssssssssssssssssssss",
    ],
    [
        "-----------------------s--------",
        "-----------------------s---F----",
        "-----------------------s--------",
        "---d-------------------s--------",
        "---#------------################",
        "-----------#--------------------",
        "--------------------------------",
        "--------------------------------",
        "--------------#-----------------",
        "--------------------------------",
        "--------------------------------",
        "----s------#--------------------",
        "----s---------------------------",
        "p---s---ssssssssssssssssssssssss",
        "################################",
    ],
    [
        "#ssssssssssssssssssssssssssssssss",
        "-------------------------------Fs",
        "-----ssssssssssssssssssssssssssss",
        "-----s---------------------------",
        "-----s-g-------------------------",
        "-----s#####----------------------",
        "-----s---------------------------",
        "-----s----------#----------------",
        "-----sssssssssss#----------------",
        "-----s----------------#----------",
        "-----s---------------------------",
        "-----s---------------------------",
        "-------------------------#-------",
        "-p-------------------------------",
        "#################################",
    ],
    [
        "#################################",
        "#-------------------------------#",
        "#--------------------s--------d-#",
        "#---#####---------####ssss#######",
        "#####---------------------------#",
        "#-------------------------------#",
        "#-------------------------------#",
        "#-------------------------------#",
        "######################ssss###---#",
        "#-------------------------------#",
        "#---##################ssss#######",
        "#g------------------------------#",
        "#####################-----#######",
        "#p------------------------s----F#",
        "#################################",
    ],
    [
        "#####p#Fs####",
        "#----g#---#-#",
        "###-#-#ss-#-#",
        "#---#---#---#",
        "#-#####-###-#",
        "#-----#-#-#-#",
        "#-###-#-#-#-#",
        "#-#---#---#-#",
        "#-#-###-###-#",
        "#-#-#---#---#",
        "#-#-#####-###",
        "#-#---------#",
        "#############",
    ],
    [
        "#################p######",
        "##-------------#sgs#####",
        "##-###########-#--s##-##",
        "##-----------#-#-####-##",
        "#####-######-#---#----##",
        "##-##-###----#####-#####",
        "##----######-##--------#",
        "#######--###----######-#",
        "##---##-#####-########-#",
        "##-#----###---####-----#",
        "##-####-###-##########-#",
        "#--####-###-##-------#-#",
        "#-##--------##-#####---#",
        "#-##-#########---#######",
        "#-##----########-##----#",
        "#-#####-##----##--#-##-#",
        "#-#####----##-###-###--#",
        "#-#---#######---#-###-##",
        "#-#-#-#########-#-----##",
        "#---#-d#------#-##-#####",
        "########-####-#-##----##",
        "#----###-###--#-#####--#",
        "#-##-###-###-##---####-#",
        "#-##-###-###-####-##---#",
        "#-##-###-###---##-##-###",
        "#-##-##----###-##-##-###",
        "#-##----#sss##-------###",
        "#--######s-s############",
        "#########sFs############"
    ]
]

window.addEventListener("keydown", (e) => {
    keys[e.key] = true;
});

window.addEventListener("keyup", (e) => {
    keys[e.key] = false;
});

window.addEventListener("keydown", (e) => {
    if ((e.key === "w" || e.key === "ArrowUp") && player.jumps > 0 && gravity !== 0){
        player.vy = -player.jumpStrength;
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

    //platforms
    for (const platform of platforms){
        ctx.drawImage(
            platformImg,
            platform.x,
            platform.y,
            platform.width,
            platform.height
        );
    }

    //spikes
    for (const spike of spikes){
        ctx.drawImage(
            spikeImg,
            spike.x,
            spike.y,
            spike.width,
            spike.height
        );
    }

    //spike switch
    if(spikeSwitch){
        ctx.drawImage(
            invertSpikeImg,
            spikeSwitch.x,
            spikeSwitch.y,
            spikeSwitch.width,
            spikeSwitch.height
        );
    }

    //gravity switch
    if(gravitySwitch){
        ctx.drawImage(
            gravImg,
            gravitySwitch.x,
            gravitySwitch.y,
            gravitySwitch.width,
            gravitySwitch.height
        )
    }

    //flag
    if(flag){
        ctx.drawImage(
            flagImg,
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
        player.x -= player.speed;
    }

    if (keys["d"] || keys["ArrowRight"]) {
        player.x += player.speed;
    }

    if (gravity === 0){
        if(keys["w"] || keys["ArrowUp"]){
            player.vy = -player.speed;
        } else if (keys["s"] || keys["ArrowDown"]){
            player.vy = player.speed;
        } else {
            player.vy = 0;
        }
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

            if(collision === topCollision && (gravity !== 0 || player.vy > 0)){
                player.y = platform.y - player.height;
                if(gravity !== 0){
                    player.vy = 0;
                    player.grounded = true;
                    player.jumps = 2;
                }
            } else if (collision === bottomCollision && (gravity !== 0 || player.vy < 0)){
                player.y = platform.y + platform.height;
                if(gravity !== 0 && player.vy < 0){
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
            player.y + player.height > spike.y &&
            spikeDeath === true
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
            spikeDeath = true;
            loadLevel(currentLevel);
        }
    }

    //spike switch collision
    if(
        spikeSwitch && 
        player.x < spikeSwitch.x + spikeSwitch.width &&
        player.x + player.width > spikeSwitch.x &&
        player.y < spikeSwitch.y + spikeSwitch.height &&
        player.y + player.height > spikeSwitch.y
    ){
        spikeDeath = false;
        spikeSwitch = null;
    }

    //gravity switch collision
        if(
            gravitySwitch &&
            player.x < gravitySwitch.x + gravitySwitch.width &&
            player.x + player.width > gravitySwitch.x && 
            player.y < gravitySwitch.y + gravitySwitch.height &&
            player.y + player.height > gravitySwitch.y
        ){
            gravity = 0;
            gravitySwitch = null;
        }

    //screen collision
    if(player.x + player.width > canvas.width){
        player.x = canvas.width - player.width;
    }

    if(player.x < 0){
        player.x = 0;
    }

    if (player.y > canvas.height){
        loadLevel(currentLevel);
    }
}

function loadLevel(index){
    const level = levels[index];
    const cols = level[0].length;
    const rows = level.length;
    const scaleX = canvas.width/cols;
    const scaleY = canvas.height/rows;

    gravity = .6 * (scaleY / (canvas.height/15));
    platforms = [];
    spikes = [];
    flag = null;
    spikeSwitch = null;
    gravitySwitch = null;

    for(let row = 0; row < level.length; row++){
        for(let col = 0; col < level[row].length; col++){

        const tile = level[row][col];

        //platform
        if(tile === "#"){
            platforms.push({
                x: col * scaleX,
                y: row * scaleY,
                width: scaleX,
                height: scaleY
            });
        }

        //spike
        if(tile === "s"){
            spikes.push({
                x: col * scaleX,
                y: row * scaleY,
                width: scaleX,
                height: scaleY
            });
        }

        //spike switch
        if(tile === "d"){
            spikeSwitch = {
                x: col * scaleX,
                y: row * scaleY,
                width: scaleX,
                height: scaleY
            };
        }

        //gravity switch
        if(tile === "g"){
            gravitySwitch = {
                x: col * scaleX,
                y: row * scaleY,
                width: scaleX,
                height: scaleY
            };
        }

        //player
        if(tile === "p"){
            player.x = col * scaleX;
            player.y = row * scaleY;
            player.width = scaleX;
            player.height = scaleY;
            player.vy = 0;
        }

        //flag
        if(tile === "F"){
            flag = {
                x: col * scaleX,
                y: row * scaleY,
                width: scaleX,
                height: scaleY
                };
            }
        }
    }
    player.grounded = false;
    player.speed = 5 * (scaleX / (canvas.height/15));
    player.jumpStrength = 12 * (scaleY / (canvas.height/15));
}

function animation(){
    movement();
    draw();
    requestAnimationFrame(animation);
}

loadLevel(currentLevel);
animation();