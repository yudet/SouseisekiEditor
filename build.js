var packager = require('electron-packager');  
var config = require('./package.json');
var targz = require('tar.gz');
var fs = require('fs');
var archiver = require('archiver');
var platform = process.env.PLATFORM;

packager({  
	dir: './',
	out: './release',
	name: 'Souseiseki Editor',
	platform: platform||'all',
	arch: 'x64',
	icon: './icon/icon',

	overwrite: true,
	asar: true,
	prune: true,
	ignore: ['node_modules/(electron-packager|electron-prebuilt|\.bin)|release\.js','release/*','src/*'],
}, (err, appPath)=> {
	if(err) {
		throw new Error(err);
	}
	// linux
	var read = targz().createReadStream('./release/Souseiseki Editor-linux-x64');
	var writeLinux = fs.createWriteStream('./release/Souseiseki Editor-linux-x64.tar.gz');
	read.pipe(writeLinux);
	
	//windows
	var archive = archiver('zip', {
		store: true // Sets the compression method to STORE. 
	});
	archive.directory('./release/Souseiseki Editor-win32-x64');
	var writeWin = fs.createWriteStream('./release/Souseiseki Editor-win32-x64.zip');
	archive.pipe(writeWin);
	writeWin.on('close',()=>{
		archive.finalize();
	});
});
