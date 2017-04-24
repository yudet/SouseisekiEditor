<template lang="pug">
div.app.d-flex.flex-column
	header-bar.p-2(:state='state')
	main-tabs-and-page.p-2(:state='state')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as localforage from 'localforage';
import Dialogs from '../dialog';
import TabsGroup from '../tabsgroup';
import Tab from '../tab';
import {FileInterpreter,MltFileInterpreter,FileInterpreterFactory} from '../file';

class State{
	constructor(){
		//localforage.getItem('highlight').then((highlight:any)=>{
		//	this.isHighlight=highlight=='true';
		//});
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
		const tab = this.writeTabToFile(true);
		if(tab){
			this.tg.lower=tab;
		}
	}
	exportFile(){
		this.writeTabToFile(false);
	}
	tg:TabsGroup=new TabsGroup();
	isHighlight:boolean=true;
}
@Component({
	props:{
		state:new State()
	}
})
export default class App extends Vue {
	state:State=new State();
}

</script>

<style scoped>
.app{
	height:100%;
}
.modal.draggable{
	display:flex;
}
</style>
