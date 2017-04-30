
<template lang="pug">
div.layers-and-editable.d-flex.flex-row.align-items-stretch
	.aa-wrapper.align-self-stretch.d-flex.flex-column
		aa-editable.p-0.aa.align-self-stretch(:state='state',:editable='!(isComposed || isAdjusting)')
		.footer.small(v-if='isComposed || isAdjusting') 
			span.info-part(:title='t("bytes-number")',data-toggle='tooltip') B:
				| {{bytes}}
		//.footer.small(v-if='!(isComposed || isAdjusting)') 
		//	span.info-part(:title='t("bytes-number")',data-toggle='tooltip') B:
		//		| {{lbytes}}
		a(v-shortkey='state.shortkeys.nextLayer',@shortkey='layerNext')
		a(v-shortkey='state.shortkeys.prevLayer',@shortkey='layerPrev')

	.p-0.flex-column.tool-buttons
		.layer.icon-layer.align-items-center.center.tool-button
			a.nav-link(:class='{disable: !scene.canUp()}',@click='layerUp()')
				i.fa.fa-angle-up.p-2
		.layer.icon-layer.align-items-center.center.tool-button
			a.nav-link(:class='{disable: !scene.canDown()}',@click='layerDown()')
				i.fa.fa-angle-down.p-2
		.layer.icon-layer.align-items-center.center.tool-button
			a.nav-link(@click='scene.add();scene.index++;',v-shortkey='state.shortkeys.addLayer',@shortkey='scene.add();scene.index++;')
				i.fa.fa-plus-circle
		.layer.icon-layer.align-items-center.center.tool-button
			a.nav-link(@click='fixFilters')
				i.fa.fa-filter

	ul.p-2.layers.nav.align-items-center.flex-column
		li.layer.nav-item.nav-item-sm.align-items-center.flex-row(v-for='(layer,lIndex) in scene.lowers',@click='selectLayer(!$event.target.matches("a.layer-close"),lIndex)')
			a.nav-link.align-items-stretch.p-2(:class='{active: scene.index===lIndex && !isComposed}')
				a.layer-close(@click='scene.close(lIndex)')
					i.fa.fa-times-circle
				div.center {{ lIndex }}
		li.layer.nav-item.nav-item-sm.align-items-center.center(@click='composing')
			a.nav-link(:class='{active: isComposed}')
				| {{t('scene-result')}}
		li.layer.nav-item.nav-item-sm.align-items-center.mt-auto(v-if='!isComposed')
			.form-group.layer-tools
				label.small {{t('offset-x')}}:
				input.form-control.form-control-sm(v-model='scene.lower.offset.x',type='number',@focus='adjusting',@blur='normal')
				label.small {{t('offset-y')}}:
				input.form-control.form-control-sm(v-model='scene.lower.offset.y',type='number',@focus='adjusting',@blur='normal')
				filter-select(:layer='scene.lower')

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as iconv from 'iconv-lite';
import Tab from '../tab.ts';
import Scene from '../scene.ts';
import Layer from '../layer.ts';
import Util from '../util.ts';
import {AAFilter,filters} from '../filter.ts';

@Component({
	props:{
		scene:Scene,
		state:null
	}
})
export default class LayerAndEditable extends Vue {
	scene:Scene;
	state:any;
	isComposed:boolean=false;
	isAdjusting:boolean=false;
	get bytes():string{
		if(!this.isComposed){
			return '';
		}
		return iconv.encode(Util.convertUtf8ToSjis(this.scene.composed),'Shift_JIS').length+'';
	}
	get lbytes():string{
		return iconv.encode(Util.convertUtf8ToSjis(this.scene.text),'Shift_JIS').length+'';
	}
	selectLayer(m:boolean,index:number){
		if(m){
			this.normal();
			this.scene.index=index;
		}
	}
	composing(){
		this.isComposed=true;
		this.isAdjusting=false;
	}
	adjusting(){
		this.isComposed=false;
		this.isAdjusting=true;
	}
	normal(){
		this.isAdjusting=false;
		this.isComposed=false;
	}
	strWidth(t:string):number{
		return Util.strWidth(t);
	}
	layerDown(){
		this.scene.down();
	}
	layerUp(){
		this.scene.up();
	}
	layerNext(){
		if(this.scene.index==this.scene.lowers.length-1){
			this.isComposed=true;
		}else{
			this.scene.next();
		}
	}
	layerPrev(){
		if(this.isComposed){
			this.scene.index=this.scene.lowers.length-1;
			this.isComposed=false;
		}else{
			this.scene.prev();
		}
	}
	get aaEditableStyle():string{
		return `padding-left:${this.scene.lower.offset.x}px!important;
			padding-top:${this.scene.lower.offset.y*18}px!important;`;
	}
	fixFilters(){
		this.scene.lower.fixFilters();
	}
}
</script>

<style lang="sass" scoped>
@import '../../styles/_variables.scss';
a{
	cursor:pointer;
}
.aa-wrapper{
	max-width:100%;
	max-height:100%;
	flex-grow:1;
	.aa{
		max-width:100%;
		max-height:100%;
		white-space:pre;
		flex-grow:1;
		resize: vertical;
	}
}
.lower-layer{
	position:absolute;
	z-index:0;
}
.upper-layer{
	position:absolute;
	z-index:500;
}
.layers-content{
	height:100%;
}
.layers-and-editable{
	flex-grow:1;
}
span.info-part{
	background-color:transparent;
	padding-left:0.5em;
	padding-right:0.5em;
	border-left-style:solid;
	border-left-width:1px;
	border-left-color:$gray-lighter;
	&:first-child{
		border-left-style:none;
	}

}
.tool-buttons{
	.tool-button{
		.nav-link{
			padding:0px;
			background:{
				color:$gray-lighter
			}
			&:hover{
				background-color:$gray-lightest;
				color:$black
			}
			color:$gray;
			&.disable{
				color:$white;
			}
		}
	}
}

.layers{
	background:{
		color:$gray;
	}
	overflow:{
		x:auto;
		y:auto;
	}
	.layer{
		cursor:pointer;
		width:10vw;
		&:not(.icon-layer){
			text-overflow: ellipsis;
			white-space: nowrap;
			min-width:10vw;
		}
		&.icon-layer{
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
			padding:1px;
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
		.layer-tools{
		}
		&:hover:not(.mt-auto){
			background-color:$gray-light;
		}
		&.mt-auto{
			cursor:default;
		}
	}
}
</style>
