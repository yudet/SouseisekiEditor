<template lang="pug">
.container-fluid.mlt-browser
	.row
		.col-6.no-padding
			select.form-control.form-control-sm(v-model='selectedDir')
				option(v-for='(dirStr,index) in list')
					| {{dirStr}}
			tree-view.tree-view(:list='aaList',:state='state')
		.col-18.no-padding
			mlt-view.mlt-view(:state='state')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import '../../styles/style.scss';
import {AASupplier,YaruyomiSupplier,FileMlt} from '../hukutemp.ts';

class State{
	selectedFileMlt:FileMlt;
	selectedDir:string;
	aas:Array<string>=[];
	getFileMlt(e:FileMlt){
		this.selectedFileMlt=e;
		this.selectedFileMlt.getAAs().then((a:Array<string>)=> {
			this.aas=a;
		});
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
	ys:AASupplier = new YaruyomiSupplier('v21.3')
	state:State=new State();
	list:Array<string>=['v21.3','v21.3.1'];
	aaList:Array<any>;
	private selectedDirStr:string;
	constructor(){
		super();
		this.selectedDir=this.list[1];
	}
	get selectedDir():string{
		this.ys.getAAList().then((d:Array<any>)=> {
			this.aaList=d;
		});
		return this.selectedDirStr;
	}
	set selectedDir(s:string){
		this.selectedDirStr=s;
		this.ys = new YaruyomiSupplier(s);
		this.ys.getAAList().then((d:Array<any>)=> {
			this.aaList=d;
		});
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
	height:100%;
	overflow:scroll;
}
.mlt-view{
	height:100%;
	overflow:scroll;
}
.no-padding{
	padding:0;
}
</style>
