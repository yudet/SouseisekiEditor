<template lang="pug">
.card.m-2
	.card-block.d-flex.flex-column
		h4.card-title {{t('config-filters-boxes')}}

		select.form-control.form-control-sm(v-model='selectedBoxFilterIndex')
			option(value='',selected='true')
			option(v-for='(filter,i) in filters.boxes',:value='i') {{filter.name}}
		form.form-inline.m-1
			.input-group.m-1
				label {{t('filter-name')}}:
				input.form-control.form-control-sm(ref='boxFilterName',v-model='selectedBoxFilterName')
			.input-group.m-1
				label {{t('filter-id')}}:
				input.form-control.form-control-sm(ref='boxFilterId',v-model='selectedBoxFilterId')
			button.btn.btn-sm(type='button',v-if='selectedBoxFilterIndex',@click='deleteBoxFilter') {{t('delete')}}
			button.btn.btn-sm(type='button',v-if='!selectedBoxFilterIndex',@click='addBoxFilter') {{t('add')}}
		box-filter-editor(v-model='selectedBoxFilterLines')
		form.form-group
			label {{t('tester')}}:
			aa-editable.aa.w-100.line(:editable='true',v-model='boxFilterTester',:is-highlight='true')
			aa-editable.aa.w-100.tested(:editable='false',v-model='boxFilterTested',:is-highlight='true')
		button.btn.btn-sm.col-3.align-self-end(type='button',@click='saveBoxFilter') {{t('save')}}
</template>

<script lang="ts">
import Vue from 'vue';
import * as localforage from 'localforage';
import * as settings from 'electron-settings';
import Component from 'vue-class-component';
import {t} from 'i18next';

import * as Filter from '../../filter';
import BoxFilterEditor from './BoxFilterEditor.vue';
import '../../../styles/style.scss';

Vue.component('box-filter-editor',BoxFilterEditor);

interface Nav{
	name:string;
}

@Component({
})
export default class Config extends Vue {
	selectedBoxFilterIndex:string='';
	addBoxFilter(){
		const id:string= $(this.$refs.boxFilterId as Element).val();
		const name:string= $(this.$refs.boxFilterName as Element).val();
		console.log(this.$refs,id,name);
		this.$set(this.filters.boxes,id,{name:name,lines:this.selectedBoxFilterLines});
	}
	deleteBoxFilter(){
		const id:string= this.selectedBoxFilterIndex;
		this.selectedBoxFilterIndex='';
		this.$delete(this.filters.boxes,id);
	}
	saveBoxFilter(){
		settings.set('filters', this.filters);
	}
	get selectedBoxFilterName():string{
		if(this.filters.boxes[this.selectedBoxFilterIndex]){
			return this.filters.boxes[this.selectedBoxFilterIndex].name;
		}
		return '';
	}
	set selectedBoxFilterName(s:string){
		if(this.filters.boxes[this.selectedBoxFilterIndex]){
			this.filters.boxes[this.selectedBoxFilterIndex].name=s;
		}
	}
	get selectedBoxFilterId():string{
		if(this.filters.boxes[this.selectedBoxFilterIndex]){
			return this.selectedBoxFilterIndex;
		}
		return '';
	}
	set selectedBoxFilterId(s:string){
	}
	boxFilterTester:string='だ、だめだよー！';
	get boxFilterTested():string{
		const filter:Filter.BoxAAFilter=new Filter.BoxAAFilter();
		filter.lines=this.selectedBoxFilterLines;
		return filter.filter(this.boxFilterTester)
	}
	get selectedBoxFilterLines():Filter.BoxLines{
		console.log(this.selectedBoxFilterIndex);
		if(!this.selectedBoxFilterIndex){
			return {ul:'',uc:'',ur:'',ml:'',mr:'',bl:'',bc:'',br:''}
		}
		return this.filters.boxes[this.selectedBoxFilterIndex].lines ;
	}
	activated(){
		console.log('activate');
	}
	c(e:any){
		console.log(e);
	}
	filters:any;
	constructor(){
		super();
		let filters:any=require('../../../../resource/filters.json5');
		if(!settings.has('filters')){
			settings.set('filters', filters);
		}
		this.filters=settings.get('filters');
		this.$nextTick().then(()=>{
			this.$forceUpdate();
		});
	}

}

</script>

<style lang="scss" scoped>
@import '../../../styles/_variables.scss';
.line{
	height:20px;
}
.tested{
	height:60px;
}
.aa{
	border-width:1px;
	border-style:solid;
	margin:1px;
	&.spacer{
		border-color:transparent;
	}
	&:not(.spacer){
		border-color:rgba(0, 0, 0, 0.15);
	}
}
</style>
