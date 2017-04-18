/// <reference path="../../node_modules/@types/electron/index.d.ts" />
import * as electron from 'electron';

import {WindowFactory} from './windowFactory';
const BrowserWindow:any = electron.BrowserWindow;

class MainWindowFactory extends WindowFactory{
	public name:string='index';
	public filePath:string='dist/index.html';
	public argForBW:any={ width: 800, height: 600 };
	public isDebug:boolean=true;
	public isMain:boolean=true;
	public isSingle:boolean=true;
	public isClosed:boolean=true;
}

class MltBrowserWindowFactory extends WindowFactory{
	public name:string='mltbrowser';
	public filePath:string='dist/mltbrowser.html';
	public argForBW:any={ width: 800, height: 600 };
	public isDebug:boolean=false;
	public isMain:boolean=false;
	public isSingle:boolean=true;
	public isClosed:boolean=true;
}

export default class WindowManager{
	private windows:Map<number,Electron.BrowserWindow>;
	private ipc:Electron.IpcMain;

	private windowFactories:Map<string,WindowFactory>;


	constructor(){
		this.windows=new Map<number,Electron.BrowserWindow>();
		this.windowFactories=new Map<string,WindowFactory>();
		this.ipc = electron.ipcMain;
		this.ipc.on('RequestCreateWindow', this.onRequestCreateWindow.bind(this) );
		this.ipc.on('RequestSendMessage', this.onRequestSendMessage.bind(this) );
		this.ipc.on('RequestSendMessageToWindows', this.onRequestSendMessageToWindows.bind(this) );
		this.ipc.on('RequestGetWindowIDs', this.onRequestGetWindowIDs.bind(this) );

		this.windowFactories.set('index',new MainWindowFactory());
		this.windowFactories.set('mltbrowser',new MltBrowserWindowFactory());
	}
	public createWindow(w:Electron.BrowserWindow,wf:WindowFactory){
		let id:number=w.id;
		wf.isClosed=false;
		wf.ids.push(id);
		w.on('closed', () => {
			wf.isClosed=true;
			let a=wf.ids.indexOf(id);
			if(a!=-1){
				wf.ids.splice(a,1);
			}
			this.windows.delete(id);
			this.notifyUpdateWindowIDs(id);
		});
		this.windows.set(id, w);
	}

	public createMainWindow():Electron.BrowserWindow{
		const wf:WindowFactory=this.windowFactories.get('index');
		if(wf!=null){
			const w:Electron.BrowserWindow = wf.create();
			this.createWindow(w,wf)
			this.notifyUpdateWindowIDs(w.id);
			return w;
		}
		return null;
	}

	private notifyUpdateWindowIDs:Function=(excludeID:number)=> {
		const windowIDs:Array<number> = [];
		for(let key of this.windows.keys()) {
			windowIDs.push(key);
		}

		this.windows.forEach((w)=> {
			if(w.id === excludeID) {
				return;
			}
			w.webContents.send('UpdateWindowIDs', windowIDs);
		});
	}
	private onRequestCreateWindow:Function=(ev:Electron.IpcMainEvent, windowName:string)=> {
		const wf:WindowFactory=this.windowFactories.get(windowName);
			console.log(windowName);
		if(wf!=null && !(wf.isSingle && !wf.isClosed)){
			const w:Electron.BrowserWindow = wf.create();
			this.createWindow(w,wf)
			ev.sender.send('FinishCreateWindow');
			this.notifyUpdateWindowIDs(w.id);
		}
	}

	private onRequestSendMessage:Function=(ev:Electron.IpcMainEvent, id:number, message:string)=> {
		const w:Electron.BrowserWindow = this.windows.get(id);
		if(w) {
			w.webContents.send('UpdateMessage', message);
		}
		ev.sender.send('FinishSendMessage');
	}

	private onRequestSendMessageToWindows:Function=(ev:Electron.IpcMainEvent, name:string, message:string)=> {
		const wf=this.windowFactories.get(name);
		for(let i=0;i<wf.ids.length;i++){
			const id=wf.ids[i];
			const w:Electron.BrowserWindow = this.windows.get(id);
			if(w) {
				w.webContents.send('UpdateMessage', message);
			}
		}
		ev.sender.send('FinishSendMessageToWindows');
	}

	private onRequestGetWindowIDs:Function=(ev:Electron.IpcMainEvent)=> {
		const windowIDs:Array<number> = Array.from(this.windows.keys());
		ev.sender.send('FinishGetWindowIDs', windowIDs);
	}
}
