<template lang="pug">
.d-flex.flex-column.mlt-view
	.aas-search.p-0
		select.form-control.form-control-sm(@change='selectCaption')
			option(v-for='(caption,index) in captions',:value='caption.index')
				| {{caption.cap}}
	.aas-view.p-0.d-flex.flex-column(ref='aasView')
		.loading(v-if='aas.length==0&&!!selectedFileMlt')
			i.fa.fa-cog.fa-spin
		.aa.align-self-stretch(v-for='(aa,index) in aas',ref='aa',:class='{ even:isEven(index) }',:style='{ width:width+"px" }',@click='sendAA(convertSjisToUtf8(aa))') {{convertSjisToUtf8(aa)}}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import IpcController from '../ipcController.ts';
import {FileMlt} from '../hukutemp.ts';
import Util from '../util.ts';
@Component({
	props:{
		mlt:FileMlt,
		aas:[],
		state:null
	},
})
export default class MltView extends Vue {
	get aas():Array<string>{
		return this.state.aas;
	}
	width:number=0;
	isLoading:boolean=true;
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
		let aa:JQuery=$((this.$refs.aa as Elements)[e.target.value]);
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
		IpcController.sendAA(aa);
	}
	constructor(){
		super();
	}
	updated(){
		let aas:JQuery=$(this.$refs.aasView as Element);
		let aa=this.$refs.aa as Element[];
		for(let i=0;i<aa.length;i++){
			this.width=Math.max(this.width,aa[i].scrollWidth);
		}
		aas.animate({
			scrollTop: 0
		},200);
	}
	convertSjisToUtf8(s:string):string{
		return Util.convertSjisToUtf8(s);
	}
}
</script>

<style lang="scss" scoped>
.aas-view{
	overflow:auto;
}
.aa{
	width:auto;
	cursor:pointer;
	white-space:pre;
	&.even{
		background-color:#DDD;
	}
}
</style>
