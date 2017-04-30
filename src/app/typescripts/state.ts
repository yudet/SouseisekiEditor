import TabsGroup from './tabsgroup';
import Tab from './tab';
import Scene from './scene';
import Layer from './layer';
import Dialogs from './dialog';
import {FileInterpreter,MltFileInterpreter,FileInterpreterFactory} from './file';

import * as settings from 'electron-settings';

export default class MainState{
	constructor(){
		//localforage.getItem('highlight').then((highlight:any)=>{
		//	this.isHighlight=highlight=='true';
		//});
		//this.tg.load();
		let shortkeys:any=require('../../resource/shortkeys.json5');

		if(!settings.has('shortkeys')){
			settings.set('shortkeys', shortkeys);
		}
		this.shortkeys=settings.get('shortkeys');
	}
	createTabFromFile(isOpen:boolean){
		const f:string[]=isOpen ? Dialogs.openFile() : Dialogs.importFile();
		if(f){
			let fi:FileInterpreter=FileInterpreterFactory.get(f[0]);
			this.tg.add(fi.getTab());
		}
	}
	writeTabToFile(isSave:boolean):Tab{
		const f:string=isSave ? Dialogs.saveFile() : Dialogs.exportFile();
		return this.writeTabToFileWithPath(f);
	}
	writeTabToFileWithPath(f:string):Tab{
		if(f){
			let fi:FileInterpreter=FileInterpreterFactory.get(f);
			fi.save(this.tg.lower,f);
			return fi.getTab();
		}
		return null;
	}
	openFile(){
		this.createTabFromFile(true);
	}
	importFile(){
		this.createTabFromFile(false);
	}
	saveFile(){
		let tab:Tab;
		if(this.tg.lower.path.endsWith('.xaa')){
			tab = this.writeTabToFileWithPath(this.tg.lower.path);
		}else{
			tab = this.writeTabToFile(true);
		}
		if(tab){
			this.tg.lower.path=tab.path;
			this.tg.lower.name=tab.name;
		}
	}
	exportFile(){
		this.writeTabToFile(false);
	}
	changed(){

	}
	isComposed:boolean=false;
	tg:TabsGroup=new TabsGroup();
	isHighlight:boolean=true;
	shortkeys:any;
}
