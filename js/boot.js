var RPG = RPG || {};
RPG.BootState = function(game) {};
RPG.BootState.prototype = {
    preload: function() {
        this.load.image('preloadBar', 'img/loading-bar.png');
    },
    create: function() {
    	// No MultiTouch
        this.input.maxPointers = 1;

        /**
        *The scale.scaleMode setting controls the scaling of our game. The available options are: EXACT_FIT, NO_SCALE and SHOW_ALL; 
        *The first option will scale the game to all the available space (100% width and height, no ratio preserved);
        *the second will disable scaling completely; and 
        *the third will make sure that the game fits in the given dimensions, 
        *but everything will be shown on the screen without hiding any fragments (and the ratio will be preserved). 
        *
        */

        this.scale.scaleMode = Phaser.ScaleManager.SHOW_ALL;
        this.scale.pageAlignHorizontally = true;
        this.scale.pageAlignVertically = true;
        //screen size will be set automatically
        this.scale.setScreenSize(true);

        this.state.start('Preloader');
    }
};