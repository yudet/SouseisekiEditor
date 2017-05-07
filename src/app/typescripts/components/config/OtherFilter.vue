<template lang="pug">
.card.m-2
	.card-block.d-flex.flex-column
		h4.card-title {{t('config-filters-others')}}

		select.form-control.form-control-sm(v-model='selectedFilterIndex')
			option(value='',selected='true')
			option(v-for='(filter,i) in filters.others',:value='i') {{filter.name}}
		form.form-inline.m-1
			.input-group.m-1
				label {{t('filter-name')}}:
				input.form-control.form-control-sm(ref='filterName',v-model='selectedFilterName')
			.input-group.m-1
				label {{t('filter-id')}}:
				input.form-control.form-control-sm(ref='filterId',v-model='selectedFilterId')
			button.btn.btn-sm(type='button',v-if='selectedFilterIndex',@click='deleteFilter') {{t('delete')}}
			button.btn.btn-sm(type='button',v-if='!selectedFilterIndex',@click='addFilter') {{t('add')}}
		vue-code(v-model='selectedFilterCode',options='codeOptions')
		form.form-group
			label {{t('tester')}}:
			aa-editable.aa.w-100.line(:editable='true',v-model='tester',:is-highlight='true')
			aa-editable.aa.w-100.tested(:editable='false',v-model='filterTested',:is-highlight='true')
		button.btn.btn-sm.col-3.align-self-end(type='button',@click='saveFilter') {{t('save')}}
</template>

<script lang="ts">
import Vue from 'vue';
import * as localforage from 'localforage';
import * as settings from 'electron-settings';
import Component from 'vue-class-component';
import {t} from 'i18next';

import * as Filter from '../../filter';
import '../../../styles/style.scss';

interface Nav{
	name:string;
}

@Component({
})
export default class Config extends Vue {
	selectedFilterIndex:string='';
	addFilter(){
		const id:string= $(this.$refs.filterId as Element).val();
		const name:string= $(this.$refs.filterName as Element).val();
		console.log(this.$refs,id,name);
		this.$set(this.filters.others,id,{name:name,func:this.selectedFilterCode});
	}
	deleteFilter(){
		const id:string= this.selectedFilterIndex;
		this.selectedFilterIndex='';
		this.$delete(this.filters.others,id);
	}
	saveFilter(){
		settings.set('filters', this.filters);
	}
	get selectedFilterName():string{
		if(this.filters.others[this.selectedFilterIndex]){
			return this.filters.others[this.selectedFilterIndex].name;
		}
		return '';
	}
	set selectedFilterName(s:string){
		if(this.filters.others[this.selectedFilterIndex]){
			this.filters.others[this.selectedFilterIndex].name=s;
		}
	}
	get selectedFilterId():string{
		if(this.filters.others[this.selectedFilterIndex]){
			return this.selectedFilterIndex;
		}
		return '';
	}
	set selectedFilterId(s:string){
	}
	editorInit() {
	}
	get selectedFilterCode():string{
		if(this.filters.others[this.selectedFilterIndex]){
			return this.filters.others[this.selectedFilterIndex].func;
		}
		return '';
	}
	set selectedFilterCode(s:string){
		if(this.filters.others[this.selectedFilterIndex]){
			this.filters.others[this.selectedFilterIndex].func=s;
		}
	}
	tester:string='だ、だめだよー！';
	get filterTested():string{
		const filter=new Filter.OtherAAFilter(this.selectedFilterCode);
		return filter.filter(this.tester);
	}
	activated(){
		console.log('activate');
	}
	c(e:any){
		console.log(e);
	}
	codeOptions:any={
		lang:'javascript'
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

		Vue.component('vue-code',require('vue-code'))
	}

}

</script>

<style lang="sass" scoped>
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
