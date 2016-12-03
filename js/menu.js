'use strict';
var RPG = RPG || {};

RPG.MenuState = function (game) {};

RPG.MenuState.prototype = {

    preload : function() {
        RPG.BGM = this.game.add.audio('bgm');
        
    
    },

    create: function () {

        //game.world.setBounds(0, 0, 1920, 1920);
        // Add menu screen.
        // It will act as a button to start the game.
        //var scoreFont = "100px Arial";
        //var scoreAnimation = this.game.add.text(30, 100, "Press or Swipe Left and Right to Move", {font: scoreFont, fill: "#39d179", stroke: "#ffffff", strokeThickness: 10, wordWrap: true, wordWrapWidth: 600}); 
        
        this.menu_background = this.game.add.image (0,0, "title");
        var logo = this.game.add.sprite (this.game.width/2, 200, 'logo');
        logo.anchor.setTo(0.5, 0.5);
        logo.alpha =0;
        //to(properties, duration, ease, autoStart, delay, repeat, yoyo) → {Phaser.Tween}
        this.game.add.tween(logo).to( { alpha: 1 }, 2000, Phaser.Easing.Sinusoidal.In, true, 0, 0, false);
        // this tween is on loop, stop it when game starts
        this.old_tween =this.game.add.tween(logo).to({y:180}, 700, Phaser.Easing.Sinusoidal.InOut, true, 0, 1000, true);

        var startButton = this.add.button(this.game.width/2, 1400, 'start', this.endAnimation, this,0,0,1);
        startButton.anchor.setTo(0.5,0.5);

        this.game.add.tween(startButton).to({y:1000}, 500, Phaser.Easing.Sinusoidal.Out, true, 0, 0, false);
        //
        var chicken = this.game.add.sprite (this.game.width/2, 710, 'bigchicken');
        chicken.frame = this.game.rnd.integerInRange(0,5);
        chicken.anchor.setTo(0.5,0.5);
        RPG.BGM.loop=  false;
        RPG.BGM.volume=0.7;
        RPG.BGM.play();
        


        //reassign them to global for animation
        this.logo = logo;
        this.chicken = chicken;
        this.startButton = startButton;

        this.versionText = this.game.add.bitmapText (520, 1100, 'flappyfont', 'Version 2', 20);


    },

    endAnimation: function () {

        this.old_tween.stop();
        animation (this.game, this.logo, 'up');
        animation (this.game, this.startButton, 'down');
        animation (this.game, this.chicken, 'up');
        //this.game.add.tween(this.chicken).to( { x: 1800 }, 1200, Phaser.Easing.Linear.None, true, 200, 0, false);
        //var tween = this.game.add.tween(this.startButton).to({y:1400}, 400, Phaser.Easing.Sinusoidal.In, true, 400, 0, false);
        var tween = this.game.add.tween(this.menu_background).to( { alpha: 0.3 }, 600, Phaser.Easing.Linear.None, true, 0, 0, false);
        
        tween.onComplete.add (this.startGame, this);


    },

    startGame: function () {

        // Change the state to the actual game.

        this.state.start('Game');

    }

};


function animation (game,object, direction){

        var easingFunction = Phaser.Easing.Sinusoidal.In;

        if (direction == 'down')
        {
            var tween_up = game.add.tween(object).to( { y: object.y-object.height/5 }, 200, easingFunction, false, 0, 0, false);
            var tween_down =game.add.tween(object).to( { y: game.height + object.height  }, 400, easingFunction, false, 0, 0, false);
            tween_up.chain(tween_down);
            tween_up.start();
        }else if (direction == 'up'){
            var tween_up = game.add.tween(object).to( { y: -object.height }, 400, easingFunction, false, 0, 0, false);
            var tween_down =game.add.tween(object).to( { y: object.y + object.height/5  }, 200, easingFunction, false, 0, 0, false);
            tween_down.chain(tween_up);
            tween_down.start();            
        }



}
