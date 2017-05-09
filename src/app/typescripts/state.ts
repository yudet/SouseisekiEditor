import TabsGroup from './tabsgroup';
import Tab from './tab';
import Scene from './scene';
import Layer from './layer';
import Dialogs from './dialog';
import * as Filter from './filter';
import {FileInterpreter,MltFileInterpreter,FileInterpreterFactory} from './file';
import IpcController from './ipcController';

import * as settings from 'electron-settings';
import Vue from 'vue';

export default class MainState{
	settings:any;
	constructor(){
		//localforage.getItem('highlight').then((highlight:any)=>{
		//	this.isHighlight=highlight=='true';
		//});
		//this.tg.load();
		this.loadSettings();
		IpcController.receive((ev:Electron.IpcRendererEvent,a:any)=>{
			let s=JSON.parse(a);
			console.log(s.name);
			if(s.name=='LoadSettings'){
				this.loadSettings()
			}
		});
	}
	loadSettingsCallbacks:Array<Function>=new Array();
	loadSettings(){
		let shortkeys:any=require('../../resource/shortkeys.json');

		if(!settings.has('shortkeys')){
			settings.set('shortkeys', shortkeys);
		}
		this.shortkeys=settings.get('shortkeys');
		let filters:any=require('../../resource/filters.json');
		if(!settings.has('filters')){
			settings.set('filters', filters);
		}
		this.filters=settings.get('filters');
		Filter.filters.length=0;
		for(let id in this.filters.boxes){
			let b:Filter.BoxAAFilter=new Filter.BoxAAFilter();
			b.id=id;
			b.name=this.filters.boxes[id].name;
			b.lines=this.filters.boxes[id].lines as Filter.BoxLines;
			Filter.filters.push(b);
		}
		for(let id in this.filters.others){
			let b:Filter.OtherAAFilter=new Filter.OtherAAFilter(this.filters.others[id].func);
			b.id=id;
			b.name=this.filters.others[id].name;
			Filter.filters.push(b);
		}
		for(let callback of this.loadSettingsCallbacks){
			callback();
		}
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
	change(){
		this.tab.isEdited=true;
	}
	isComposed:boolean=false;
	tg:TabsGroup=new TabsGroup();
	get tab():Tab{
		return this.tg.lower;
	}
	get scene():Scene{
		return this.tab.lower;
	}
	get layer():Layer{
		return this.scene.lower;
	}
	isHighlight:boolean=true;
	shortkeys:any;
	filters:any;
}
