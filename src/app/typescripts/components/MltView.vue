<template lang="pug">
.d-flex.flex-column.mlt-view
	.aas-search
		select.form-control.form-control-sm(@change='selectCaption')
			option(v-for='(caption,index) in captions',:value='caption.index')
				| {{caption.cap}}
	.aas-view(ref='aasView')
		div.aa(v-for='(aa,index) in aas',:ref='"aa"+index',:class='{ even:isEven(index) }',@click='sendAA(aa)') {{aa}}
</template>

<script lang="ts">
import Vue from 'vue';
import IpcController from '../ipcController.ts';
import Component from 'vue-class-component';
import {FileMlt} from '../hukutemp.ts';
import * as $ from 'jquery';
@Component({
	props:{
		mlt:FileMlt,
		aas:[],
		state:null
	},
})
export default class MltBrowser extends Vue {
	get aas():Array<string>{
		return this.state.aas;
	}
	get captions():[{cap:string,index:number}]{
		let r:[{cap:string,index:number}]=[] as [{cap:string,index:number}];
		for(let i=0;i<this.aas.length; i++){
			if(this.isCaption(this.aas[i])){
				r.push({cap:this.aas[i],index:i});
			}
		}
		return r;
	}
	selectCaption(e:any):void{
		let aa:JQuery=$(this.$refs['aa'+e.target.value] as Element);
		let aas:JQuery=$(this.$refs.aasView as Element);
		aas.animate({
			scrollTop: aa.offset().top - aas.offset().top + aas.scrollTop()
		},200);
	}
	isEven(n:number):boolean{
		return n % 2 == 0;
	}
	isCaption(aa:string):boolean{
		return !aa.match(/[\n\r]/);
	}
	state:any;
	sendAA(aa:string){
		console.log(aa);
		IpcController.sendAA(aa);
	}
	constructor(){
		super();
	}
}
</script>

<style lang="sass" scoped>
.aas-view{
	flex-grow:1;
	overflow:scroll;
}
.aa{
	cursor:pointer;
	white-space:pre;
	&.even{
		background-color:#DDD;
	}
}
</style>
