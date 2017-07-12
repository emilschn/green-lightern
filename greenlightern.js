var conf = require('./app/config.js'),
	repoConf = require('./app/repo-config.js');

updageGit( conf, repoConf );


function updageGit( conf, repoConf ) {
	
	console.log( 'Managing repo ' + repoConf.id );

	var fs = require('fs');
	if ( !fs.existsSync( repoConf.localPath ) ){
		fs.mkdirSync( repoConf.localPath );
	}
	
	var completePath = repoConf.localPath + '/' + repoConf.id;
	if ( fs.existsSync( completePath ) ) {
		console.log( 'Path ' + completePath + ' exists' );
		var simpleGit = require('simple-git')( completePath );
		console.log( 'pulling...' );
		simpleGit.checkout( 'master' );
		simpleGit.pull( 'origin', 'master' ).exec(
			function() {
				console.log('pulling done.');
				gitCheckoutBranch( simpleGit, conf, repoConf );
			}
		);

	} else {
		console.log( 'Path ' + completePath + ' does not exist' );
		var simpleGit = require('simple-git')( repoConf.localPath );
		console.log( 'cloning...' );
		simpleGit.clone( repoConf.url, repoConf.id ).exec(
			function() {
				console.log('cloning done.');
				gitCheckoutBranch( simpleGit, conf, repoConf );
			}
		);

	}
		
}

function gitCheckoutBranch( simpleGit, conf, repoConf ) {
	simpleGit.checkoutLocalBranch( repoConf.newBranch ).exec(function() {
		optimizeImages( conf, repoConf );
	});
}

function optimizeImages( conf, repoConf ) {
	
	console.log( '...........' );
	console.log( 'Optimizing images for ' + repoConf.id );
	
	var imagemin = require('imagemin');
	var imageminJpegtran = require('imagemin-jpegtran');
	var imageminPngquant = require('imagemin-pngquant');
	
	var iCompleted = 0;
	var nImages = repoConf.folders.length;
	for ( var i = 0; i < nImages; i++ ) {
		
		var folder = repoConf.folders[i];
		var completePath = repoConf.localPath + '/' + repoConf.id + '/' + folder;
		var filePath = folder.split( '/' );
			filePath.pop();
			filePath = filePath.join( '/' );
		var outputPath = repoConf.localPath + '/' + repoConf.id + '/' + filePath;
		console.log( 'Optimizing image ' + completePath );

		imagemin( [ completePath + '/*.{jpg,png}' ], outputPath, {
			plugins: [
				imageminJpegtran(),
				imageminPngquant({quality: '65-80'})
			]
			
		}).then(
			files => {
				iCompleted++;
				console.log( 'Optimization done '+iCompleted+' / '+nImages );
				if ( iCompleted === nImages ) {
					commitChanges( conf, repoConf );
				}
			}
		);
		
	}
	
}

function commitChanges ( conf, repoConf ) {
	
	var completePath = repoConf.localPath + '/' + repoConf.id;
	var simpleGit = require('simple-git')( completePath );
	console.log( 'Adding files...' );
	simpleGit.add( '*' ).exec( function() {
			
		console.log( 'Commiting changes...' );
		simpleGit.commit( repoConf.commitMessage ).exec( function() {
			
			console.log( 'Pushing on ' + repoConf.newBranch + '...' );
			simpleGit.push( 'origin', repoConf.newBranch );
			
		} );

	} );
	
}