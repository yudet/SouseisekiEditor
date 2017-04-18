import * as electron from 'electron'
import WindowManager from './windowManager'
let app:Electron.App = electron.app;
let BrowserWindow:any = electron.BrowserWindow;
let wm:WindowManager;
let main:Electron.BrowserWindow;
function startMainWindow() {
	wm=new WindowManager();
	main=wm.createMainWindow();
}
app.on('ready', startMainWindow);
app.on('window-all-closed', function () {
	if (process.platform !== 'darwin') {
		app.quit();
	}
});
app.on('activate', function () {
	if(main==null){
		startMainWindow();
	}
});
