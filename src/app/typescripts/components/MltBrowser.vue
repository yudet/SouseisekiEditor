<template lang="pug">
.container-fluid.mlt-browser
	.row
		.col-6.p-0.d-flex.flex-column.align-items-stretch
			select.select-dir.p-0.form-control.form-control-sm(v-model='selectedDir',@change='loadAAList',@load='loadAAList')
				option(v-for='(dirStr,index) in list')
					| {{dirStr}}
			div.p-0.m-0.tree-view.align-self-stretch
				tree-view(:list='aaList',:state='state',@dirOpen='dirOpen',v-if='searchStr.length==0&&!isLoading')
				.loading
					i.fa.fa-cog.fa-spin(v-if='searchStr.length==0&&isLoading')
			input.p-0.form-control.form-control-sm(v-model='searchStr')
		mlt-view.mlt-view.col-18.p-0.align-items-stretch(:state='state')
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
	ys:AASupplier;
	state:State=new State();
	list:Array<string>=['v21.3','v21.3.1','v21.4'];
	aaList:Array<any>;
	searchStr:string='';
	private selectedDirStr:string;
	isLoading:boolean=true;
	selectedDir:string;
	constructor(){
		super();
		this.state=new State();
		this.selectedDir=this.list[2];
		this.$nextTick(()=>{this.loadAAList()});
	}
	loadAAList(){
		this.ys = new YaruyomiSupplier(this.selectedDir);
		this.isLoading=true;
		this.ys.getAAList().then((l)=>{
			this.aaList=l;
			this.isLoading=false;
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
	height:100%;
	flex-grow:1;
}
.loading{
	flex-grow:1;
	text-align:center;
	vertical-align:middle;
}
</style>
