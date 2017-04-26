<template lang="pug">
div.page-and-tabgroup.d-flex.flex-column.align-items-stretch
	.d-flex.flex-row.tabs
		div.p-2.tab(v-for='(tab,index) in tg.lowers',@click='selectTab(!$event.target.matches("a.tab-close"),index)',:class='{active: index===tg.index}')
			a.tab-close(@click='close(index)')
				i.fa.fa-times-circle
			div.center 
				span(v-if='tab.isEdited') +
				| {{ tab.name }}
		a.p-2.tab.icon-tab.center(@click='add',v-if='tg.enableAddTab')
			i.fa.fa-plus-circle

	.p-2.tabs-content.d-flex.flex-column.align-self-stretch.justify-content-end
		layers-and-editable.p-2.align-self-stretch.full-height(:scene='tab.lower',:state='state')
		ul.p-2.scenes.nav.align-items-center
			li.scene.nav-item.align-items-center(v-for='(scene,sIndex) in tab.lowers',@click='selectScene(!$event.target.matches("a.scene-close"),sIndex)')
				a.nav-link.align-items-stretch(:class='{active: tab.index===sIndex}')
					a.scene-close(@click='tab.close(sIndex)')
						i.fa.fa-times-circle
					div.center(@click='tab.index=sIndex') {{ sIndex }}:
						span(contenteditable='true',@blur='scene.name=$event.target.textContent;$event.target.textContent=scene.name') {{ scene.name }}
			li.scene.icon-scene.align-items-center.center(@click='tab.add()')
				a.nav-link
					i.fa.fa-plus-circle
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import electron from 'electron';

import TabsGroup from '../tabsgroup';
import Tab from '../tab';
import Scene from '../scene';
import Layer from '../layer';
import {FileInterpreter,MltFileInterpreter,FileInterpreterFactory} from '../file';
import IpcController from '../ipcController';

@Component({
	props:{
		state:null
	},
})
export default class TabsAndPage extends Vue {
	get tg():TabsGroup{
		return this.state.tg;
	}
	state:any;
	get tab():Tab{
		return this.tg.lower;
	}
	set tab(t:Tab){
		this.tg.lower=t;
	}
	get tabs():Array<Tab>{
		return this.tg.lowers;
	}
	set tabs(t:Array<Tab>){
		this.tg.lowers=t;
	}
	selectTab(m:boolean,index:number):void{
		if(m){this.tg.index=index}
	}
	selectScene(m:boolean,index:number):void{
		if(m){this.tab.index=index}
	}
	close(index: number):void{
		this.tg.close(index);
		return;
	}
	add():void{
		this.tg.add();
	}
	constructor(){
		super();

		IpcController.receiveAA((ev:Electron.IpcRendererEvent,a:any)=>{
			let s=JSON.parse(a);
			if(s.name=='SendAA'){
				this.tg.lower.lower.add(new Layer({text:s.contents}),this.tg.lower.lower.index+1);
				this.tg.lower.lower.index++;
			}
		});

		this.tg.load().then((lowers:Array<Tab>)=>{
			this.tabs=lowers;
		});
	}
}
</script>

<style lang="sass" scoped>
@import '../../styles/_variables.scss';
div.page-and-tabgroup{
	flex-grow:1;
	padding:0px !important;
}
a{
	cursor:pointer;
}
.tabs-content{
	flex-grow:1;
	padding:0px !important;
	.tab-content{
		&.active{
			flex-grow:1;
		}
	}
}

.tabs {
	background:{
		color:$gray;
	}
	.tab{
		cursor:pointer;
		font-size:12px;
		border-width:0;
		width:100%;
		&:not(.icon-tab){
			overflow: hidden;
			text-overflow: ellipsis;
			white-space: nowrap;
			// width:100%;
		}
		&.icon-tab{
			padding:0;
			width:3em;
			color:black;
		}
		color:$gray-lightest;
		background-color:$gray;
		.tab-close{
			color:black;
			opacity:0.5;
			&:hover{
				opacity:1;
			}
		}
		div.center{
			display:inline-block;
			text-align:center;
			width:100%
		}
		border-width:0;
		&.active{
			color:$gray;
			background-color:$gray-lighter;
			&:hover{
				background-color:$gray-lighter;
			}
		}
		&:hover{
			background-color:$gray-light;
		}
	}
}
.scenes {
	background:{
		color:$gray;
	}
	overflow:{
		x:auto;
		y:hidden;
	}
	.scene{
		cursor:pointer;
		width:10vw;
		&:not(.icon-scene){
			text-overflow: ellipsis;
			white-space: nowrap;
			min-width:10vw;
		}
		&.icon-scene{
			padding:0;
			color:black;
			width:3em;
		}
		color:$gray-lightest;
		background-color:$gray;
		.tab-close{
			color:black;
			opacity:0.5;
			&:hover{
				opacity:1;
			}
		}
		div.center{
			display:inline-block;
			text-align:center;
			width:100%
		}
		border-width:0;
		.nav-link{
			&.active{
				color:$gray;
				background-color:$gray-lighter;
				&:hover{
					background-color:$gray-lighter;
				}
			}
			.center{
				span{
					cursor:text;
				}
			}
		}
		&:hover{
			background-color:$gray-light;
		}
	}
}
</style>
