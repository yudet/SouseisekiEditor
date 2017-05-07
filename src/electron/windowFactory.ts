import * as path from 'path';
import * as electron from 'electron'
const BrowserWindow:any = electron.BrowserWindow;
let app:Electron.App = electron.app;

export abstract class WindowFactory {
	public isSingle:boolean;
	public isDebug:boolean;
	public isMain:boolean;
	public isClosed:boolean;
	public name:string;
	public filePath:string='dist/index.html';
	public argForBW:any={ width: 800, height: 600 };
	public ids:Array<number>=[];
	public create():Electron.BrowserWindow{
		this.isDebug=process.env.DEBUG=='true';
		console.log(this.isDebug);
		let w:Electron.BrowserWindow=new BrowserWindow(this.argForBW);
		w.loadURL(`file://${path.join(__dirname,'..','..',this.filePath)}`);
		if(this.isDebug){
			w.webContents.openDevTools();
		}
		if(this.isMain){
			w.on('close', ()=> {
				app.quit();
			});
		}else{
			w.on('close', ()=> {
				w.hide();
			});
		}
		if(!this.isDebug){
			w.setMenu(null);
		}
		w.setTitle('Souseiseki Editor');
		return w;
	}
}
