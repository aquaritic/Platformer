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
const dashImg = new Image();
dashImg.src = "dash.png";
const backgroundImg = new Image();
backgroundImg.src = "background.png";

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
player.jumpStrength = 5;
player.speed = 5;
player.dashing = false;
player.dashTimer = 0;
player.dashDirection = 1;
player.dashMode = false;

let platforms = [];
let spikes = [];
let backgrounds = [];
let flag = null;
let gravitySwitch = null;
let spikeSwitch = null;
let dashSwitch = null;
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
        "#--------------------g----------#",
        "#---##################ssss#######",
        "#-------------------------------#",
        "#####################-----#######",
        "#p------------------------s----F#",
        "#################################",
    ],
    [
        "#####p#Fs####",
        "#-----#---#-#",
        "###-#-#ss-#-#",
        "#---#-g-#---#",
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
        "##-------------##-######",
        "##-###########-#--###-##",
        "##-----------#-#-####-##",
        "#####-######-#g--#----##",
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
    ],
    [
        "----------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "-b--------------------------------------",
        "###-------------------------------------",
        "--------------------------------------F-",
        "-------------------------------------###",
        "---------##------------------------------",
        "-p--------------------------------------",
        "###-------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "ssssssssssssssssssssssssssssssssssssssss",
    ],
    [
        "----------------------------------------",
        "----------------------------------------",
        "-----------F----------------------------",
        "-----------#----------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "---------------------##-----------------",
        "----------------------------------------",
        "----------------------------------------",
        "-------b--------------------------------",
        "-----###--------------------------------",
        "----------------------------------------",
        "--p-------------------------------------",
        "-###------------------------------------",
        "----------------------------------------",
        "----------------------------------------",
        "ssssssssssssssssssssssssssssssssssssssss",
    ],
    [
        "ssFss",
        "ss-ss",
        "ss-ss",
        "p---g",
        "#####",
    ],
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
    for(const background of backgrounds){
        ctx.drawImage(
            backgroundImg,
            background.x,
            background.y,
            background.width,
            background.height
        );
    }

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

    //dash switch
    if(dashSwitch){
        ctx.drawImage(
            dashImg,
            dashSwitch.x,
            dashSwitch.y,
            dashSwitch.width,
            dashSwitch.height
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

    if(keys[" "] && !player.dashing && player.dashMode){
        player.dashing = true;
        player.dashTimer = 10;
        player.dashDirection = (keys["d"] || keys["ArrowRight"]) ? 1 : -1;
    }

    if (player.dashTimer > 0){
        player.x += player.dashDirection * player.speed * 3;
        player.dashTimer--;
    } else {
        player.dashing = false;
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
            window.location.href = "victory.html";
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

    //dash switch collision
    if(
        dashSwitch &&
        player.x < dashSwitch.x + dashSwitch.width &&
        player.x + player.width > dashSwitch.x &&
        player.y < dashSwitch.y + dashSwitch.height &&
        player.y + player.height > dashSwitch.y 
    ){
        player.dashMode = true;
        dashSwitch = null;
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
    backgrounds = [];
    flag = null;
    spikeSwitch = null;
    gravitySwitch = null;
    dashSwitch = null;
    player.dashMode = false;

    for(let row = 0; row < level.length; row++){
        for(let col = 0; col < level[row].length; col++){

        const tile = level[row][col];

        //background
        if(tile !== "#"){
            backgrounds.push({
                x: col * scaleX,
                y: row * scaleY,
                width: scaleX,
                height: scaleY
            });
        }

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

        //dash switch
        if(tile === "b"){
            dashSwitch = {
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
    if (index === 10){
        player.speed = 15
    } else {
        player.speed = 5 * (scaleX / (canvas.height/15));
    }
    player.jumpStrength = 12 * (scaleY / (canvas.height/15));
}

function animation(){
    movement();
    draw();
    requestAnimationFrame(animation);
}

loadLevel(currentLevel);
animation();