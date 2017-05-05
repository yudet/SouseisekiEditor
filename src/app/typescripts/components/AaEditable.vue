
<template lang="pug">
div.aa-editable
	.back.aa(v-html='html',:style='{top:-top+"px",left:-left+"px"}',v-if='isHighlight')
	textarea.aa.main(@scroll='scroll',:value='value',@input='updateValue($event.target.value)',v-if='editable')
	textarea.aa.main(@scroll='scroll',v-model='value',readonly='true',v-if='!editable')
</template>

<script lang="ts">
import Vue from 'vue';
import * as $ from 'jquery';
import Component from 'vue-class-component';
import Tab from '../tab.ts';
import Scene from '../scene.ts';
import Layer from '../layer.ts';
import Util from '../util.ts';

interface Event {
	clipboardData: any;
	preventDefault: Function;
}
class EditableRange{
	start:number
	end:number
	get collapsed():boolean{
		return this.start===this.end;

	}
	constructor(start:number,end:number){
		this.start=start;
		this.end=end;
	}
}
function insertStr(str:string, index:number, insert:string):string {
	return str.slice(0, index) + insert + str.slice(index, str.length);
}
@Component({
	props:{
		editable:false,
		value:'',
		isHighlight:true,
		hasChangeEvent:false
	},
})
export default class AaEditable extends Vue {
	state:any;
	editable:boolean;
	top:number=0;
	left:number=0;
	value:string='';
	isHighlight:boolean=true;
	hasChangeEvent:boolean=false;
	updateValue(value:string){
		this.value=value
 		this.$emit('input', value)
		if(this.hasChangeEvent){
 			this.$emit('changed')
		}
	}
	get html():string{
		if(!this.isHighlight){
			return '';
		}else{
			return Util.getHighlight(this.value);
		}
	}
	scroll(e:any){
		let f:boolean=false;
		if(Math.abs(this.top-(e.target as Element).scrollTop)>10
			||
			Math.abs(this.left-(e.target as Element).scrollLeft)>10){
			f=true;
		}
		this.top=(e.target as Element).scrollTop;
		this.left=(e.target as Element).scrollLeft;
	}
}
</script>

<style scoped>
.aa-editable{
	position:relative;
	overflow:hidden;
	box-sizing:border-box;
}
textarea.aa{
	display:inline;
	position:absolute;
	border:none;
	padding:0px;
	background-color:transparent;
	z-index:5;
	top:0px;
	left:0px;
	white-space: pre;
	resize:none;
	height:100%;
	width:100%;
	&:focus{
		outline:0;
		border:none;
	}
}
.back{
	white-space:pre;
	position:absolute;
	background-color:transparent;
	z-index:0;
	color:transparent;
	top:0px;
	left:0px;
	min-height:100%;
	min-width:100%
}
</style>
