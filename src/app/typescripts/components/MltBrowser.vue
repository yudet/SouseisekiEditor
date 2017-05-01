<template lang="pug">
.container-fluid.mlt-browser
	.row
		.col-6.p-0.d-flex.flex-column
			select.select-dir.p-0.form-control.form-control-sm(v-model='selectedDir',@change='loadAAList',@load='loadAAList')
				option(v-for='(dirStr,index) in list')
					| {{dirStr}}
			div.p-0.m-0.tree-view.align-self-stretch
				tree-view(:list='aaList',:state='state',@dirOpen='dirOpen',v-if='!isSearch&&!isLoading')
				tree-view(:list='searchDir',:state='state',@dirOpen='dirOpen',v-if='isSearch&&!isLoading')
				.loading
					i.fa.fa-cog.fa-spin(v-if='searchStr.length==0&&isLoading')
			form.search.input-group.input-group-sm.form-control.form-control-sm(@submit.prevent.stop='search()')
				input.p-0.form-control.form-control-sm(v-model='searchStr',@keyup.enter='search()')
				span.p-0.input-group-btn.form-control-sm
					button.btn.btn-secondary.btn-sm(@click='search()') {{t('search-start')}}
		mlt-view.mlt-view.col-18.p-0.align-items-stretch(:state='state')
</template>

<script lang="ts">
import Vue from 'vue';
import * as localforage from 'localforage';
import Component from 'vue-class-component';
import {t} from 'i18next';
import '../../styles/style.scss';
import {AASupplier,YaruyomiSupplier,FileMlt,Mlt,YaruyomiFileMlt,DirectoryMlt} from '../hukutemp.ts';

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
	searchDir:Array<Mlt>=[];
	isSearch:boolean=false;
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
	searchWithHierarchy(){
		if(this.searchStr==null){
			return;
		}
		let choose=(l:DirectoryMlt)=>{
			let r:DirectoryMlt=new DirectoryMlt(),t:boolean=false;
			for(let i in l.contents){
				if(l.contents[i].title.match(this.searchStr)){
					t=true;
					r.contents.push(l.contents[i]);
				} else if(l.contents[i].isDirectory){
					let dirRes:{contains:boolean,dirMlt:DirectoryMlt}=choose(l.contents[i] as DirectoryMlt);
					if(dirRes.contains){
						console.log(i,l.contents[i].title);
						t=true;
						r.contents.push(dirRes.dirMlt);
					}
				}
			}
			r.title=l.title;
			return {contains:t,dirMlt:r}
		}
		let dm:DirectoryMlt=new DirectoryMlt();
		dm.contents=this.aaList;
		let d=choose(dm);
		console.log(d);
		if(d.contains){
			this.isSearch=true;
			this.searchDir=d.dirMlt.contents;
		}
	}

	search(){
		const d:{contains:boolean,dirMlt:DirectoryMlt}=this.searchSimple(this.searchStr);
		if(d.contains){
			this.isSearch=true;
			this.searchDir=d.dirMlt.contents;
		}else{
			this.isSearch=false;
			this.searchDir=[];
			this.$forceUpdate();
		}
	}
	searchSimple(s:string):{contains:boolean,dirMlt:DirectoryMlt}{
		let r:DirectoryMlt=new DirectoryMlt(),searchStrs:Array<string>=s.split(/ |　/);
		let choose=(l:DirectoryMlt,path:string[])=>{
			let t:boolean=false;
			for(let i in l.contents){
				let fPath:boolean=true;
				let fFileName:boolean=false;

				//パスに含まれているか
				for(let searchStr of searchStrs){
					fPath=fPath && !!path.concat([l.contents[i].title]).join('/').match(searchStr);
				}

				//少なくともファイル名に一つ含まれているか
				for(let searchStr of searchStrs){
					fFileName=fFileName || !!l.contents[i].title.match(searchStr);
				}
				if(fPath&&fFileName){
					t=true;
					r.contents.push(l.contents[i]);
				}
				if(l.contents[i].isDirectory){
					if(choose(l.contents[i] as DirectoryMlt,path.concat([l.contents[i].title])).contains){
						t=true;
					}
				}
			}
			return {contains:t,dirMlt:r}
		}
		let dm:DirectoryMlt=new DirectoryMlt();
		dm.contents=this.aaList;
		let d:{contains:boolean,dirMlt:DirectoryMlt}=choose(dm,[]);
		return d;
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
.search{
	min-height:calc(2.25rem + 2px)
}
</style>
