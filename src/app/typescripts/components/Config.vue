<template lang="pug">
.container-fluid.config.h-100
	.row.h-100
		.col-3.nav.flex-column
			li.nav-item
				a.nav-link(:class='{active: selectedNav==i}',v-for='(nav,i) in navs',href='#',@click='selectedNav=i') {{nav.name}}
		.col-21
			.container-fluid(v-if='selectedNav=="config-shortkeys"')
			.container-fluid.flex-column.align-items-stretch(v-show='selectedNav=="config-filters"')
				.card.m-2
					.card-block.d-flex.flex-column
						h4.card-title {{t('config-filters-boxes')}}

						select.form-control.form-control-sm(v-model='selectedBoxFilterIndex')
							option(value='',selected='true')
							option(v-for='(filter,i) in filters.boxes',:value='i') {{filter.name}}
						form.form-group.p-2
							filter-editor(v-model='selectedBoxFilterLines')
						aa-editable.row-5
</template>

<script lang="ts">
import Vue from 'vue';
import * as localforage from 'localforage';
import * as settings from 'electron-settings';
import Component from 'vue-class-component';
import {t} from 'i18next';

import * as Filter from '../filter';
import '../../styles/style.scss';

interface Nav{
	name:string;
}

@Component({
})
export default class Config extends Vue {
	navs:any={
		'config-shortkeys':{name:t('config-shortkeys')},
		'config-filters':{name:t('config-filters')}
	};
	selectedNav:string='config-filters';
	selectedBoxFilterIndex:string='';
	get selectedBoxFilterLines():any{
		console.log(this.selectedBoxFilterIndex);
		if(!this.selectedBoxFilterIndex){
			return {ul:'',uc:'',ur:'',ml:'',mr:'',bl:'',bc:'',br:''}
		}
		return this.filters.boxes[this.selectedBoxFilterIndex].lines ;
	}
	activated(){
		console.log('activate');
	}
	shortkeys:any;
	filters:any;
	constructor(){
		super();
		let shortkeys:any=require('../../../resource/shortkeys.json5');

		if(!settings.has('shortkeys')){
			settings.set('shortkeys', shortkeys);
		}
		this.shortkeys=settings.get('shortkeys');

		let filters:any=require('../../../resource/filters.json5');
		if(!settings.has('filters')){
			settings.set('filters', filters);
		}
		this.filters=settings.get('filters');
		this.$nextTick().then(()=>{
			console.log(this.selectedBoxFilterIndex)
			this.$forceUpdate();
		});
	}

}

</script>

<style lang="sass" scoped>
@import '../../styles/_variables.scss';
.line{
	height:20px;
}
.aa{
	border-width:1px;
	border-style:solid;
	border-color:$gray;
	margin:1px;
	&.spacer{
		border-color:transparent;
	}
	&:not(.spacer){
		border-color:$gray;
	}
}
</style>
