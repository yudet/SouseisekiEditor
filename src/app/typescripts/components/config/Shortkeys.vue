<template lang="pug">
.card.m-2
	.card-block.d-flex.flex-column
		h4.card-title {{t('config-shortkeys')}}
		table.table
			tbody
				tr.flex-column(v-for='(shortkey,iShorykey) in shortkeys')
					th {{iShorykey}}
					td(v-for='n in 5')
						input.form-control.form-control-sm(v-model='shortkey[n-1]')
		button.btn.btn-sm.col-3.align-self-end(type='button',@click='save') {{t('save')}}
</template>

<script lang="ts">
import Vue from 'vue';
import * as localforage from 'localforage';
import * as settings from 'electron-settings';
import Component from 'vue-class-component';
import {t} from 'i18next';

import * as Filter from '../../filter';
import '../../../styles/style.scss';

@Component({
})
export default class Shortkeys extends Vue {
	shortkeys:any;
	constructor(){
		super();
		let shortkeys:any=require('../../../../resource/filters.json5');
		if(!settings.has('shortkeys')){
			settings.set('shortkeys', shortkeys);
		}
		this.shortkeys=settings.get('shortkeys');
		this.$nextTick().then(()=>{
			this.$forceUpdate();
		});
	}
	save(){
		console.log(this.shortkeys);
		settings.set('shortkeys', this.shortkeys);
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
