
<template lang="pug">
div.aa-editable
	.back.aa(v-html='html',:style='{top:-top+"px",left:-left+"px"}',v-if='state.isHighlight')
	textarea.aa.main(@input='changed',@scroll='scroll',v-model='text',v-if='editable')
	textarea.aa.main(@input='changed',@scroll='scroll',v-model='composed',readonly='true',v-if='!editable')
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
		state:null
	},
})
export default class AaEditable extends Vue {
	state:any;
	editable:boolean;
	get scene():Scene{
		return this.state.scene as Scene;
	}
	get layer():Layer{
		return this.state.layer as Layer;
	}
	get composed():string{
		if(!this.editable){
			console.log('n');
			return '';
		}
		return this.scene.composed;
	}
	top:number=0;
	left:number=0;
	changed(e:Event):void{
	}
	get text():string{
		return this.layer.text/* .replace(/\n/g,'<br>') */;
	}
	set text(s:string){
		this.state.change();
		this.layer.text=s;
	}
	get html():string{
		if(!this.state.isHighlight){
			return '';
		}else if(this.editable){
			return Util.getHighlight(this.text);
		}else{
			return Util.getHighlight(this.composed);
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
	min-width:100%;
	min-height:100%;
	top:0px;
	left:0px;
	white-space: pre;
	resize:none;
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
	height:100%;
	width:100%
}
</style>
