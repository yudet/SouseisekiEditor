<template lang="pug">
.container-fluid.config.h-100
	.row.h-100
		.col-3.nav.flex-column
			li.nav-item
				a.nav-link(:class='{active: selectedNav==i}',v-for='(nav,i) in navs',href='#',@click='selectedNav=i') {{nav.name}}
		.col-21.row-24(:style='{"overflow-y":"scroll"}')
			.container-fluid(v-if='selectedNav=="config-shortkeys"')
				shortkeys-config
			.container-fluid.flex-column.align-items-stretch(v-show='selectedNav=="config-filters"')
				box-filter-config
				other-filter-config
</template>

<script lang="ts">
import Vue from 'vue';
import * as localforage from 'localforage';
import * as settings from 'electron-settings';
import Component from 'vue-class-component';
import {t} from 'i18next';
import BoxFilterConfig from './config/BoxFilter.vue';
import OtherFilterConfig from './config/OtherFilter.vue';
import ShortkeysConfig from './config/Shortkeys.vue';

import * as Filter from '../filter';
import '../../styles/style.scss';

Vue.component('box-filter-config',BoxFilterConfig);
Vue.component('other-filter-config',OtherFilterConfig);
Vue.component('shortkeys-config',ShortkeysConfig);

@Component({
})
export default class Config extends Vue {
	navs:any={
		'config-shortkeys':{name:t('config-shortkeys')},
		'config-filters':{name:t('config-filters')}
	};
	selectedNav:string='config-filters';
	constructor(){
		super();
	}
}

</script>

<style lang="sass" scoped>
@import '../../styles/_variables.scss';
.line{
	height:20px;
}
.tested{
	height:60px;
}
.aa{
	border-width:1px;
	border-style:solid;
	border-color:$gray-lightest;
	margin:1px;
	&.spacer{
		border-color:transparent;
	}
	&:not(.spacer){
		border-color:$gray;
	}
}
</style>
