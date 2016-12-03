var RPG = RPG || {};

RPG.game = new Phaser.Game(640,960 , Phaser.CANVAS, '');

RPG.game.state.add('Boot', RPG.BootState);
RPG.game.state.add('Preloader', RPG.PreloadState);
RPG.game.state.add('Menu', RPG.MenuState);
RPG.game.state.add('Game', RPG.GameState);
RPG.game.state.start('Boot');
