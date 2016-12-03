'use strict';
var RPG = RPG || {};

RPG.mute = false;

RPG.GameState = function (game){};
RPG.GameState.prototype = {

    preload : function() {
    // anything here should be in the preloader
    },

    create: function () {
        //this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.game.scale.fullScreenScaleMode = Phaser.ScaleManager.EXACT_FIT;
        //need to set portrait orientation

        // set world height higher so there's more room for stuff to fly in before it gets killed by outof boudns kill
        this.game.world.setBounds(0, 0, 640, 2000);
        this.hasMagnet = false;


        this.game_map = new Map(this.game);

        ////////////////////////////////////////////////////////
        // firework starts
        this.firework = this.game.add.emitter (-20,-20, 100);
        this.firework.makeParticles('firework');
        this.firework.gravity = -200;
        //this.firework.setAlpha(1, 0.1, 2000);
        //this.firework.setScale(minX, maxX, minY, maxY, rate, ease, yoyo)
        this.firework.setScale(0.1, 1, 0.1, 1, 100, Phaser.Easing.Circular.Out, false)
        this.firework.setYSpeed(-800,800);
        this.firework.setXSpeed(-800,800);
        //////////////////////////////////////////////////////////

        // function : Player(game, x, y, player, gravity, speed)
        this.player = new Player(this.game, 320, 100, "chicken", 2000, 400);
        this.levelscore = 100;
        this.level = 0;
        this.levelmsg = ["Good Job!", "Fantastic!", "2.5k Points!", "Can You Go Higher?", "Almost There!" ,"God Like!", "Okay, You Beat The Game", "Still Playing?", "Damn, Email Me"];
        this.point = 1;
        this.score = 0;
        this.scoreBuffer = 0;
        this.scoreText = this.game.add.bitmapText(this.game.width/2, -300, 'flappyfont', this.score.toString(),80);
        this.scoreText.visible = true;
        this.game.add.tween(this.scoreText).to({y:10}, 500, Phaser.Easing.Sinusoidal.Out, true, 0, 0, false);

        this.scoreText.align = 'center';
        this.scoreLabelTween = this.add.tween(this.scoreText.scale).to({ x: 1.5, y: 1.5}, 200, Phaser.Easing.Linear.In).to({ x: 1, y: 1}, 200, Phaser.Easing.Linear.In);

        this.scoreboard = new Scoreboard (this.game);


        this.coinSound= this.game.add.audio('coin_sound');
        this.landSound= this.game.add.audio('land_sound');
        this.deadSound= this.game.add.audio('dead_sound');
        this.powerSound = this.game.add.audio('power_sound');



        //console.log ("game height: "+ this.game.height+ " world height: "+this.game.world.height);

        this.volumeButton = this.add.button(this.game.width- 100, 30, 'volume', this.mutesound, this,0,0,1);
        this.volumeButton.anchor.setTo(0.5,0.5);
        if (!RPG.mute){
            this.volumeButton.setFrames(0, 0, 1);
        }else{
            this.volumeButton.setFrames(2, 2, 3);

        }
        //particle effect
        //this.game.input.onDown.add(this.particleBurst, this);

    },
    update : function (){
        this.game.physics.arcade.collide (this.player, this.game_map.platformHolder, this.platformHandler,null,this);
        this.game.physics.arcade.overlap(this.player, this.game_map.boundHolder, this.gameOverHandler, null, this);
        this.game.physics.arcade.overlap (this.player, this.game_map.coinHolder, this.candyHandler, null, this);
        

        if (this.scoreBuffer > 0){

            if (this.scoreBuffer > 100){
                this.incrementScore(10);
                this.scoreBuffer -=10;
            }else{
                this.incrementScore(1);
                this.scoreBuffer -- ;
            }
        }


        if(this.score == this.levelscore){
            //console.log("reached ");
            this.createLevelAnimation(this.levelmsg[this.level]);
            if (this.levelscore < 1000)
                this.levelscore *= 10;
            else
                this.levelscore *=2.5;
            this.level ++;
        }

        //magnet event
        this.game.physics.arcade.overlap (this.player, this.game_map.magnet, this.magnetHandler,null,this);
        if (this.hasMagnet){
            this.game_map.coinHolder.setAllChildren('homing', true, true, false, 0, true);
        }
        this.game_map.coinHolder.forEach(magnetGot, this, true, this.game, this.player);

        // pepper event
        //this.game.physics.arcade.overlap (this.player, this.game_map.pepper, this.pepperHandler,null,this);

        // Point event
        this.game.physics.arcade.overlap (this.player, this.game_map.plus, this.plusHandler,null,this);
        //

        if (!RPG.BGM.isPlaying){
            RPG.BGM.play();
        }

    },
    particleBurst: function (pointer) {

    //  Position the emitter where the mouse/touch event was
    this.firework.x = pointer.x;
    this.firework.y = pointer.y;

    //  The first parameter sets the effect to "explode" which means all particles are emitted at once
    //  The second gives each particle a 2000ms lifespan
    //  The third is ignored when using burst/explode mode
    //  The final parameter (10) is how many particles will be emitted in this single burst
    
    var clr = Math.random() * 0xffffff;
    this.firework.forEachDead(function(particle) {
    // tint every particle
    //particle.tint = clr;
    });

    this.firework.start(true, 400, null, 20);

    },

    mutesound: function (){
        if (RPG.mute){
            this.volumeButton.setFrames(0, 0, 1);
            this.game.sound.mute = false;
            RPG.mute=false;

        }else{
            this.volumeButton.setFrames(2, 2, 3);
            this.game.sound.mute = true;
            RPG.mute=true;

        }

    },
    incrementScore: function (num) {
        this.score +=num;
        this.scoreText.setText (this.score.toString());
        this.scoreText.x = this.game.width/2 - (this.scoreText.textWidth/2);
    },
    createScoreAnimation: function(x, y, message, score){
     
        var me = this;
     
        var scoreFont = "20px Arial";
     
        //Create a new label for the score
        var scoreAnimation = me.game.add.text(x, y, message, {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 10}); 
        scoreAnimation.anchor.setTo(0.5, 0);
        scoreAnimation.align = 'center';
     
        //Tween this score label to the total score label
        var scoreTween = me.game.add.tween(scoreAnimation).to({x:me.game.world.centerX, y: 50}, 800, Phaser.Easing.Exponential.In, true);
     
        //When the animation finishes, destroy this score label, trigger the total score labels animation and add the score
        scoreTween.onComplete.add(function(){
            scoreAnimation.destroy();
            me.scoreLabelTween.start();
            me.scoreBuffer += score;
        }, me);
    },
    createLevelAnimation: function(message){
     
        var me = this;
        var x = this.game.width/2;
        var y = this.game.height/2;
     
        var scoreFont = "80px Arial";
        //Create a new label for the score
        var scoreAnimation = me.game.add.text(x, y, message, {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 30}); 
        scoreAnimation.anchor.setTo(0.5, 0);
        scoreAnimation.align = 'center';
        //Tween this score label to the total score label
        var scoreTween = me.game.add.tween(scoreAnimation).to({x:me.game.world.centerX, y: 50}, 800, Phaser.Easing.Exponential.In, true);
        scoreTween.onComplete.add(function(){
            scoreAnimation.destroy();
        }, me);

    },

    gameOverHandler :function (){
        this.scoreboard.show(this.score);
        this.scoreText.visible = false;
        this.hasMagnet = false;
        //this.deadSound.play();
        this.player.kill();
    },
    platformHandler : function (player, platform){
        if (!platform.played){
            this.landSound.play();
            platform.played = true;
        }
        
    },
    magnetHandler : function (player, magnet){
        magnet.kill();
        this.powerSound.play();
        this.hasMagnet = true;
        this.game.time.events.add(Phaser.Timer.SECOND*6, this.resetMagnet, this);
    },
    /*
    pepperHandler : function (player, pepper){
        pepper.kill();
        player.movespeed *=2;
        player.previousvelocity *=2;
        player.body.gravity.y *=2;
        this.game.time.events.add(Phaser.Timer.SECOND*5, this.resetPlayerSpeed, this);
    },
    */
    plusHandler : function (player, plus){
        plus.kill();
        this.powerSound.play();
        this.point ++;
    },
    resetMagnet: function (){
        this.hasMagnet = false;
    },
    /*
    resetPlayerSpeed: function (){
        this.player.movespeed /=2;
        this.player.body.gravity.y /=2;
    },
*/
    candyHandler :function (player, candy){

        this.createScoreAnimation(player.x + player.width/2, candy.y, '+'+this.point.toString(), this.point);
        candy.kill ();
        this.coinSound.play();
    }


    
};
// magenetfunction that moves the coins into the player
function magnetGot (coin, game, player){
//    game.physics.arcade.accelerateToObject(displayObject, destination, speed, xSpeedMax, ySpeedMax) 
    if (coin.homing){
        game.physics.arcade.moveToObject(coin, player, 800) ;
    }
        
}

