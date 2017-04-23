<template lang="pug">
.container-fluid.mlt-browser
	.row
		.col-6.no-padding.d-flex.flex-column.align-items-stretch
			select.select-dir.p-0.form-control.form-control-sm(v-model='selectedDir')
				option(v-for='(dirStr,index) in list')
					| {{dirStr}}
			div.p-0.m-0.tree-view.align-self-stretch
				tree-view(:list='aaList',:state='state',@dirOpen='dirOpen',v-if='searchStr.length==0')
			input.p-0.form-control.form-control-sm(v-model='searchStr')
		.col-18.no-padding
			mlt-view.mlt-view(:state='state')
</template>

<script lang="ts">
import Vue from 'vue';
import * as localforage from 'localforage';
import Component from 'vue-class-component';
import {t} from 'i18next';
import '../../styles/style.scss';
import {AASupplier,YaruyomiSupplier,FileMlt,Mlt,YaruyomiFileMlt} from '../hukutemp.ts';

class State{
	selectedFileMlt:FileMlt;
	selectedDir:string;
	aas:Array<string>=[];
	getFileMlt(e:FileMlt){
		if(e.mltType==='yaruyomi'){
			this.selectedFileMlt = e as YaruyomiFileMlt;
		}
		this.selectedFileMlt.getAAs().then((a:Array<string>)=> {
			this.aas=a;
		});
	}
	saveOpen(){
	}
}

@Component({
	props:{
		list:Array,
		state:new State(),
		aaList:Array
	}
})
export default class MltBrowser extends Vue {
	ys:AASupplier = new YaruyomiSupplier('v21.4')
	state:State=new State();
	list:Array<string>=['v21.3','v21.3.1','v21.4'];
	aaList:Array<any>;
	searchStr:string='';
	private selectedDirStr:string;
	constructor(){
		super();
		this.state=new State();
		this.selectedDir=this.list[1];
	}
	get selectedDir():string{
		return this.state.selectedDir;
	}
	set selectedDir(s:string){
		this.state.selectedDir=s;
		this.ys = new YaruyomiSupplier(s);
		this.ys.getAAList().then((l)=>{
			this.aaList=l;
		});
	}
	dirOpen(){
		const chooseIsOpen=(l:Array<any>)=>{
			let r:Array<any>=[];
			for(let i in l){
				if(l[i].isDirectory){
					r[i]={isOpen:l[i].isOpen,contents:chooseIsOpen(l[i].contents)};
				}else{
					r[i]=[];
				}
			}
			return r;
		}
		localforage.setItem(this.ys.id,chooseIsOpen(this.aaList));
	}
}

</script>

<style scoped>

.mlt-browser{
	height:100%;
	overflow:hidden;
}
.row{
	height:100%;
}
.tree-view{
	overflow:auto;
	flex-grow:1;
}
.select-dir{
	min-height:1.8125rem;
}
.mlt-view{
}
.no-padding{
	padding:0;
}
</style>
