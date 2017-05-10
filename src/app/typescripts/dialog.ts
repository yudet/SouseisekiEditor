import {remote} from 'electron';
import {t} from 'i18next';
const Dialog:Electron.Dialog = remote.dialog;
export default class Dialogs{
	private static openFileBase(f:[{name:string,extensions:[string]}]):string[] {
		let o:string[]=Dialog.showOpenDialog(null, {
			properties: ['openFile'],
			title: t('open-file'),
			defaultPath: '.',
			filters: f
		});
		if(!!o){
			return o;
		}else{
			return null;
		}
	}
	static openFile():string[] {
		return Dialogs.openFileBase([
			{name: t('xaa-file'), extensions: ['xaa']},
		]);
	}
	static importFile():string[] {
		return Dialogs.openFileBase([
			{name: t('mlt-file'), extensions: ['mlt']},
			{name: t('ast-file'), extensions: ['ast']},
			{name: t('text-file'), extensions: ['txt']},
		]);
	}
	static saveFile():string {
		return Dialog.showSaveDialog(null, {
			title: t('save-file'),
			defaultPath: '.',
			filters: [
				{name: t('xaa-file'), extensions: ['xaa']},
			]
		});
	}
	static exportFile():string {
		return Dialog.showSaveDialog(null, {
			title: t('export-file'),
			defaultPath: '.',
			filters: [
				{name: t('mlt-file'), extensions: ['mlt']},
				{name: t('ast-file'), extensions: ['ast']},
				{name: t('text-file'), extensions: ['txt']},
			]
		});
	}
	static messageClose(message:string):number{
		return Dialog.showMessageBox(null, {
			title:t('warning'),
			message:message,
			buttons:[t('ok'),t('cancel'),t('dialog-never')],
			type:'warning'
		});
	}
	static messageCloseTab():number{
		return Dialogs.messageClose(t('tab-close-message'));
	}
	static messageCloseScene():number{
		return Dialogs.messageClose(t('scene-close-message'));
	}
	static messageCloseLayer():number{
		return Dialogs.messageClose(t('layer-close-message'));
	}
}

