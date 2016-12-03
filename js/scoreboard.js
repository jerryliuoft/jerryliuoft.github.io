function Scoreboard (game){
	//console.log('in Scoreboard');
	var gameover;

	Phaser.Group.call (this, game);
	gameover = this.create(this.game.width/2, 50, 'gameover');
	gameover.anchor.setTo(0.5,0.5);
	

	this.scoreboard = this.create(this.game.width/2, 200, 'scoreboard');


	this.scoreboard.anchor.setTo(0.5,0.5);


	this.scoreText = this.game.add.bitmapText (380, 180, 'flappyfont', '', 26 );
	this.add(this.scoreText);

	this.bestScoreText = this.game.add.bitmapText (380, 230, 'flappyfont', '', 26);
	this.add(this.bestScoreText);
	

	//add our start button with a callback
	this.startButton = this.game.add.button (this.game.width/2, 350, 'start', this.startClick, this,0,0,1);
	this.startButton.anchor.setTo(0.5,0.5);

	this.add(this.startButton);

	this.y = this.game.height;
	this.x = 0;
	//console.log('OutScoreBoard!!');

};
Scoreboard.prototype = Object.create(Phaser.Group.prototype);
Scoreboard.prototype.constructor = Scoreboard;

Scoreboard.prototype.show = function (score){
	var medal,bestScore;
	//setp 1
	this.scoreText.setText(score.toString());
	if(localStorage){
		bestScore = localStorage.getItem('bestScore');
		if(!bestScore || bestScore<score){
			bestScore = score;
			localStorage.setItem('bestScore',bestScore);
		}

	}else{
		//FallBack . localstorage isn't available
		bestScore= 'N/A';
	}

	this.bestScoreText.setText(bestScore.toString());
/*
	if(score >= 10 && score< 20){
		medal = this.game.add.sprite (-65, 7, 'medals', 1);
		medal.anchor.setTo(0.5,0.5);
		this.scoreboard.addChild(medal);

	}else if (score >=20){
		medal = this.game.add.sprite (-65,7,'medals',0);
		medal.anchor.setTo(0.5,0.5);
		this.scoreboard.addChild(medal);
	}


	if(medal){
		var emitter = this.game.add.emitter(medal.x, medal.y, 400);
		this.scoreboard.addChild(emitter);
		emitter.width = medal.width;
		emitter.height = medal.height;
		emitter.makeParticles('particle');
		emitter.setRotation (-100,100);
		emitter.setXSpeed(0,0);
		emitter.setYSpeed(0,0);
		emitter.minParticleScale= 0.25;
		emitter.maxParticleScale = 0.5;
		emitter.setAll('body.allowGravity', false);

		emitter.start(false,1000,1000);

	}
	*/

	this.game.add.tween(this).to ({y:300}, 1500, Phaser.Easing.Bounce.Out, true);
};

Scoreboard.prototype.startClick= function(){
	this.game.state.start('Game');
}
