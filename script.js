"use strict";


let canvas1 = document.getElementById("canvas1");
canvas1.width = 500;
canvas1.height = 500;
let landsize = prompt("yo enter a level size real quick (a number between 20-500)")
let land_x = landsize;
let land_y = landsize;

let x_scale = canvas1.width/land_x;
let y_scale = canvas1.height/land_y;

let ctx1 = canvas1.getContext("2d");

let canvas2 = document.getElementById("canvas2");
canvas2.width = canvas1.width;
canvas2.height = canvas1.height;
let ctx2 = canvas2.getContext("2d");

const KEYS = {};
const PLAYERS = [];
const EXPL_PARTICLE = [];
const BULLETS = [];

class block{

    constructor(color="black",x,y){
        this.color = color;
        this.x = x;
        this.y = y;
    }

    changecolor(color){
        this.color = color;
        this.render();        
    }

    togglecolor(){
        if(this.color ==="black")
        {this.changecolor("white")}
        else
        {this.changecolor("black")}
    }

    render(){
        ctx1.fillStyle = this.color;
        ctx1.fillRect(this.x*x_scale,this.y*y_scale,x_scale,y_scale);
    }

}

const LANDSCAPE = [];
for(let y = 0; y < land_y; y++){
    LANDSCAPE[y] = [];
    for(let x = 0; x < land_x; x++){
        if(y< land_y/2){
            LANDSCAPE[y].push(new block("white",x,y));
        }else{
            LANDSCAPE[y].push(new block("black",x,y));
        }
    }
}   
console.log(LANDSCAPE)


LANDSCAPE.forEach((y,yi)=>{y.forEach((x)=>{
x.render();
})})

class player{

    constructor(x,y){
        this.x = x ; 
        this.y = y ;
        this.size = 4;
        this.xa = 0;
        this.ya = 0;
        this.dir = 0;
        PLAYERS.push(this);        
    }

    update(){
        
        let xpos = Math.floor(this.x/x_scale);
        let ypos = Math.floor(this.y/y_scale);
        
        
        
        this.ya += y_scale/9;
        

        if(KEYS["d"]){
            this.xa += x_scale/15;
        }
        if(KEYS["a"]){
            this.xa -= x_scale/15;
        }

        if(KEYS["w"]){
            this.ya = -y_scale;
        }

        if(KEYS["ArrowRight"]){
            this.dir += Math.PI/30;
        }

        if(KEYS["ArrowLeft"]){
            this.dir -= Math.PI/30;
        }

        if(KEYS[" "]){
            new explosion_particle(this.x+this.size/2,this.y+this.size/2,this.dir,x_scale/2.5 ,"none",3,5);
        }
        
        
        if(ypos+this.size !== land_y && xpos+this.size < land_x){
            for(let sizeposy= 0;sizeposy<this.size ; sizeposy++){
                if(LANDSCAPE[ypos+sizeposy][xpos+this.size].color ==="black" ){
                    this.x = (xpos*x_scale)-0.0001;
                    this.xa = 0;
                }
            }
            
            for(let sizeposy= 0;sizeposy<this.size ; sizeposy++){
                if(LANDSCAPE[ypos+sizeposy][xpos].color ==="black" ){
                    this.x = ((xpos+1)*x_scale)+0.0001
                    this.xa = 0;
                }
            }
            
            
            for(let sizeposx= 0;sizeposx<this.size+1 ; sizeposx++){
                if(LANDSCAPE[ypos+this.size][xpos+sizeposx].color ==="black" ){
                    this.y = (ypos*y_scale)-0.0001;
                    this.ya = 0
                }
            }
            
            for(let sizeposx= 0;sizeposx<this.size+1 ; sizeposx++){
                if(LANDSCAPE[ypos][xpos+sizeposx].color ==="black" ){
                    this.y = ((ypos+1)*y_scale)+0.0001
                    this.ya = 0;
                }
            }
            
        }

        
        this.ya *= 0.99;
        this.xa *= 0.9;
        
        this.y += this.ya;
        this.x += this.xa;
        
        if(this.y >= canvas2.height-y_scale*this.size){
            this.y = canvas2.height-y_scale*this.size;
        }

        if(this.y < 0){
            this.y = 0;
        }
        
        if(this.x+(this.size*x_scale) > canvas2.width){
            this.x = canvas2.width-(this.size*x_scale);
        }

        if(this.x < 0){
            this.x = 0;
        }
        
    }

    render(){
        ctx2.strokeRect(this.x,this.y,this.size*x_scale,this.size*y_scale);
        ctx2.fillStyle = "white";
        ctx2.fillRect(this.x,this.y,this.size*x_scale,this.size*y_scale);
    }
}

class explosion_particle{
    
    constructor(x,y,dir,vel,grav,size,speeddeath){
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.vel = vel;
        this.grav = grav;
        this.speeddeath = speeddeath;
        this.size = size;
        this.xa = 0;
        this.ya = 0;
        EXPL_PARTICLE.push(this);
    }

    update(i){
        let xpos = Math.floor(this.x/x_scale);
        let ypos = Math.floor(this.y/y_scale);

        this.xa += Math.cos(this.dir)*this.vel;
        this.ya += Math.sin(this.dir)*this.vel;

        if(this.grav !== "none"){
            this.ya += y_scale/this.grav; 
        }

        if(this.speeddeath !== "none"){
            if(this.vel < x_scale/this.speeddeath){
                EXPL_PARTICLE.splice(i,1);
            }
        }

        this.ya *= 0.9; 
        this.xa *= 0.9; 
        this.vel *= 0.9; 


        this.x += this.xa;
        this.y += this.ya;

        if(this.x > canvas2.width){
            EXPL_PARTICLE.splice(i,1);
        }
        if(this.x < 0){
            EXPL_PARTICLE.splice(i,1);
        }

        if(this.y >= canvas2.height){
            EXPL_PARTICLE.splice(i,1);
        }
        if(this.y < 0){
            EXPL_PARTICLE.splice(i,1);
        }

        if(ypos+this.size < land_y && xpos+this.size < land_x){
            for(let sizeposx= 0;sizeposx<this.size+1 ; sizeposx++){
            for(let sizeposy= 0;sizeposy<this.size+1 ; sizeposy++){  
            LANDSCAPE[ypos+sizeposx][xpos+sizeposx].changecolor("white"); 
            }}       
        }

    }
    

    render(){
        ctx2.strokeRect(this.x,this.y,this.size*x_scale,this.size*y_scale);
        ctx2.fillStyle = "white";
        ctx2.fillRect(this.x,this.y,this.size*x_scale,this.size*y_scale);
    }

}

class bullet {

    constructor(x,y,dir,vel,grav,size,speeddeath){
        this.x = x;
        this.y = y;
        this.dir = dir;
        this.vel = vel;
        this.grav = grav;
        this.speeddeath = speeddeath;
        this.size = size;
        this.xa = 0;
        this.ya = 0;
        BULLETS.push(this);
    }

    update(i){
        let xpos = Math.floor(this.x/x_scale);
        let ypos = Math.floor(this.y/y_scale);

        this.xa += Math.cos(this.dir)*this.vel;
        this.ya += Math.sin(this.dir)*this.vel;

        if(this.grav !== "none"){
            this.ya += y_scale/this.grav; 
        }

        if(this.speeddeath !== "none"){
            if(this.vel < x_scale/this.speeddeath){
                EXPL_PARTICLE.splice(i,1);
            }
        }
        this.ya *= 0.9; 
        this.xa *= 0.9; 
        this.vel *= 0.9; 


        this.x += this.xa;
        this.y += this.ya;

        if(this.x > canvas2.width){
            EXPL_PARTICLE.splice(i,1);
        }
        if(this.x < 0){
            EXPL_PARTICLE.splice(i,1);
        }

        if(this.y >= canvas2.height){
            EXPL_PARTICLE.splice(i,1);
        }
        if(this.y < 0){
            EXPL_PARTICLE.splice(i,1);
        }

        if(ypos+this.size !== land_y && xpos+this.size !== land_x){
            for(let sizeposx= 0;sizeposx<this.size+1 ; sizeposx++){
            for(let sizeposy= 0;sizeposy<this.size+1 ; sizeposy++){  
            LANDSCAPE[ypos+sizeposx][xpos+sizeposx].changecolor("white"); 
            }}       
        }

    }
    

    render(){
        ctx2.strokeRect(this.x,this.y,this.size*x_scale,this.size*y_scale);
        ctx2.fillStyle = "white";
        ctx2.fillRect(this.x,this.y,this.size*x_scale,this.size*y_scale);
    }


}

function createexplosion(x,y,amount,size,range){
    for(let expl= 0; expl<amount;expl++){
        new explosion_particle(x,y,Math.random()*Math.PI*2,x_scale/(randomrange(size,size+10)+Math.random()),"none",2,range);
    }
}

function randomrange(min, max) { 
    return Math.floor(Math.random() * (max - min + 1) + min)
}


new player(10,10);
let lastRenderTime = 0;
let GameSpeed = 200;
let lastGameSpeed = 60

function main(currentTime){
    window.requestAnimationFrame(main);
    const sslr = (currentTime- lastRenderTime)/1000
    if (sslr < 1 / GameSpeed) {return}
    lastRenderTime = currentTime;  
    update();
    render();

}
window.requestAnimationFrame(main); 

function update(){
PLAYERS.forEach(v=>v.update());
EXPL_PARTICLE.forEach((v,i)=>v.update(i));
}

function render(){
ctx2.clearRect(0,0,canvas2.width,canvas2.height);
EXPL_PARTICLE.forEach(v=>v.render());
PLAYERS.forEach(v=>v.render());
}


addEventListener("keydown", e => {
    // console.log("key: ",e.key);
    KEYS[e.key] = true;
});


addEventListener("keyup", e => {
    KEYS[e.key] = false;
});