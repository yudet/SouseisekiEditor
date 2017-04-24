var packager = require('electron-packager');  
var config = require('./package.json');

packager({  
	dir: './',
	out: './release',
	name: 'Souseiseki Editor',
	platform: 'linux',
	arch: 'x64',

	overwrite: true,
	asar: true,
	prune: true,
	ignore: ['node_modules/(electron-packager|electron-prebuilt|\.bin)|release\.js','release/*','src/app/*'],
}, function done (err, appPath) {
	if(err) {
		throw new Error(err);
	}
	console.log('Done!!');
});
