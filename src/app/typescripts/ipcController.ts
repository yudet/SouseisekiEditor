import {ipcRenderer} from 'electron';
export default class IpcController{

	static sendAA(aa:string){
		ipcRenderer.send('RequestSendMessageToWindows','index',JSON.stringify({name:'SendAA',contents:aa}));
	}
	static loadSettings(){
		ipcRenderer.send('RequestSendMessageToWindows','index',JSON.stringify({name:'LoadSettings'}));
	}
	static receive(f:Electron.IpcRendererEventListener){
		ipcRenderer.on('UpdateMessage',f);
	}
	static startWindow(t:string){
		ipcRenderer.send('RequestCreateWindow',t);
	}
}
