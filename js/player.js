//player class

'use strict'

 function Player(game, x, y, player, gravity, speed){
	console.log('in Player!');

    this.keyboardMovement = true;
    this.movespeed = speed;

	Phaser.Sprite.call(this, game, x, y, player);
   	this.game.physics.arcade.enableBody(this);

    this.previous_touching = false;
   
    this.anchor.setTo(0.5,0.5);
	game.add.existing(this);
	this.game = game;

    //set up the keyboard for moving
    this.cursors = this.game.input.keyboard.createCursorKeys();

    //add mouse/touch controls

    //this.game.input.onDown.add(this.beginSwipe, this);
    this.mouse = this.game.input.mousePointer;

    this.previousvelocity = 0;



    this.body.bounce.y = 0.1;
    this.body.gravity.y = gravity;
    this.body.collideWorldBounds = true;


    this.animations.add('walk');
    //this.createEmitter();




	
};
Player.prototype = Object.create(Phaser.Sprite.prototype);
Player.prototype.constructor = Player;

// when the player begins to swipe we only save mouse/finger coordinates, remove the touch/click
// input listener and add a new listener to be fired when the mouse/finger has been released,
// then we call endSwipe function
Player.prototype.beginSwipe = function (){
    console.log ("begining swipe");
    this.startX = this.game.input.worldX;
    this.startY = this.game.input.worldY;
    this.game.input.onDown.remove(this.beginSwipe);
    this.game.input.onUp.add(this.endSwipe, this);
}

// function to be called when the player releases the mouse/finger
Player.prototype.endSwipe = function (){
    console.log ("ending swipe");
    // saving mouse/finger coordinates
    this.endX = this.game.input.worldX;
    this.endY = this.game.input.worldY;
    // determining x and y distance travelled by mouse/finger from the start
    // of the swipe until the end
    var distX = this.startX-this.endX;
    var distY = this.startY-this.endY;
    // in order to have an horizontal swipe, we need that x distance is at least twice the y distance
    // and the amount of horizontal distance is at least 10 pixels
    if(Math.abs(distX)>Math.abs(distY)*2 && Math.abs(distX)>10){
        // moving left, calling move function with horizontal and vertical tiles to move as arguments
        if(distX>0){
                this.move(-1,0);
           }
           // moving right, calling move function with horizontal and vertical tiles to move as arguments
           else{
                this.move(1,0);
           }
    }else{
        //this.move(0,0);
    }

    // stop listening for the player to release finger/mouse, let's start listening for the player to click/touch
    this.game.input.onDown.add(this.beginSwipe, this);
    this.game.input.onUp.remove(this.endSwipe);
}

Player.prototype.move =  function (deltaX, deltaY){
    console.log ("moving");

    if (deltaX >0){
        this.previousvelocity = this.movespeed;
        this.scale.x = -1;
    } else if (deltaX <0){
        this.previousvelocity = -this.movespeed;
        this.scale.x = 1;

    }else{
        this.previousvelocity = 0;
    }
}

Player.prototype.createEmitter =function (){
    //create a emmiter
    this.emitter = this.game.add.emitter(200, 300, 1000);
    this.emitter.makeParticles('cake');
    this.emitter.minParticleScale = 0.3;
    this.emitter.maxParticleScale = 0.3;
    this.emitter.setYSpeed(-600, -400);




}

Player.prototype.update= function (){

    this.body.velocity.x = this.previousvelocity;
    this.animations.play('walk', 30, true);

    // reset velocity
    //this.body.velocity.x = 0;

    if (this.keyboardMovement){

        if (this.cursors.left.isDown)
        {
            this.previousvelocity = -this.movespeed;
            this.scale.x = 1;
            //this.animations.play('walk', 10, true);
            
        }
        else if (this.cursors.right.isDown)
        {
            this.previousvelocity = this.movespeed;
            this.scale.x = -1;
            //this.animations.stop(1);

        }

    }else{
        if (this.mouse.worldX < this.x)
        {
            this.previousvelocity = -this.movespeed;
            this.scale.x = 1;
            //this.animations.play('walk', 10, true);
            
        }
        else if ( this.mouse.worldX >= this.x)
        {
            this.previousvelocity = this.movespeed;
            this.scale.x = -1;
            //this.animations.stop(1);

        }

    }





    // on touch ground, play sound


    /*
    // (explode, lifespan, frequency, quantity, forceQuality)
    this.emitter.start(false, 600, 30,1);
    if (!this.body.touching.down){

        this.emitter.emitX = this.x;
        this.emitter.emitY = this.y;

    }else{
        this.emitter.emitX = 0;
        this.emitter.emitY = 0;        
    }
    */

}
