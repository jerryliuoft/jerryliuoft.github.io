//Enemy class

'use strict'

 function Enemy(game, map, floors, player){
	console.log('in Enemy!');

    this.floor_tile_size_height = 80;
    this.floor_tile_size_width = 100;
    // the vision of this, to spot the player, chase player if in view; 
    this.view_distance = 5;
    this.distance_to_player_x= 999;
    this.distance_to_player_y= 999;


    //set up the sprite to the correct location
    var startPos = this.findStartPosition(floors, map);

	Phaser.Sprite.call(this, game, startPos.x, startPos.y, "Cat Girl");
    
	this.game.physics.arcade.enableBody(this);
    this.body.setSize(this.floor_tile_size_width, this.floor_tile_size_height, 0, 50);

    //this.anchor.setTo(0.5,0.5);
	game.add.existing(this);
	this.game = game;
    this.floors = floors;
    this.maps = map;
    this.player = player;
    this.initKeyboard(game);

	
};
Enemy.prototype = Object.create(Phaser.Sprite.prototype);
Enemy.prototype.constructor = Enemy;

Enemy.prototype.findStartPosition = function (floors, map){
    var startPos = floors.getRandom();
    while(map[startPos.data.x_index][startPos.data.y_index].movable == false){
        startPos = floors.getRandom();
    }
    map[startPos.data.x_index][startPos.data.y_index].movable = false;
    map[startPos.data.x_index][startPos.data.y_index].has_enemy = true;


    return startPos;
}


Enemy.prototype.initKeyboard = function (game){

    // add the up down left right keys for movement
    this.key1 = game.input.keyboard.addKey(Phaser.Keyboard.UP);
    this.key1.onUp.add(this.move, this);
    this.key2 = game.input.keyboard.addKey(Phaser.Keyboard.DOWN);
    this.key2.onUp.add(this.move, this);
    this.key3 = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);
    this.key3.onUp.add(this.move, this);
    this.key4 = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);
    this.key4.onUp.add(this.move, this);

}

Enemy.prototype.move = function(){
    if (Math.abs(this.distance_to_player_x) +Math.abs(this.distance_to_player_y) < this.view_distance){
        //see player
        console.log("See player");
        if(Math.abs(this.distance_to_player_x) > Math.abs(this.distance_to_player_y)){
            if (this.distance_to_player_x >0) {
                // move left
                if (this.canMove(-1, 0)){
                    this.x -= this.floor_tile_size_width;
                }
            }else{
                // move right
                if (this.canMove(1,0)){
                    this.x += this.floor_tile_size_width;
                }
            }
        }else{
            if (this.distance_to_player_y >0) {
               // move up
                if (this.canMove(0,-1)){
                    this.y -= this.floor_tile_size_height;
                }
            }else{
                //move down
                if (this.canMove(0 , 1)){
                    this.y += this.floor_tile_size_height;
                }
            }

        }

    }else{
        //move randomly, add later

    }
}
// check if there's no obsticles there
Enemy.prototype.canMove = function (x ,y){

    var x_index = this.x/this.floor_tile_size_width;
    var y_index = this.y/this.floor_tile_size_height;

    if (this.maps[x_index+ x][y_index+ y].movable== true){
        this.maps[x_index+ x][y_index+ y].has_enemy = true;
        this.maps[x_index+ x][y_index+ y].movable = false;
        //reset old tile
        this.maps[x_index][y_index].has_enemy = false;
        this.maps[x_index][y_index].movable = true;
        return true;
    }
    return false;
}


Enemy.prototype.update= function (){


    this.distance_to_player_x =(this.x - this.player.x)/this.floor_tile_size_width;
    this.distance_to_player_y =(this.y - this.player.y)/this.floor_tile_size_height;
   
}
