<template lang="pug">
.p-0
	label.small {{t('filter')}}
	select.form-control.form-control-sm(v-model='selectedFilter')
		option(value='',selected='true')
		option(v-for='(filter, fIndex) in filterList',:value='filter.id')
			| {{filter.name}}
	table.p-0(v-if='layer.filters.length>0',)
		tr.small(v-for='(filter,fIndex) in layer.filters')
			td {{fIndex}}: {{searchFilter(filter).name}}
			td.p-0
				a.p-0.fa.fa-times-circle(@click='remove(fIndex)')
				a.p-0.fa.fa-angle-up(@click='up(fIndex)')
				a.p-0.fa.fa-angle-down(@click='down(fIndex)')

</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import Tab from '../tab.ts';
import Scene from '../scene.ts';
import Layer from '../layer.ts';
import Util from '../util.ts';
import {AAFilter,filters} from '../filter.ts';

@Component({
	props:{
		layer:Layer
	}
})
export default class FilterSelect extends Vue {
	layer:Layer;
	get filterList():AAFilter[]{
		return filters
	};
	searchFilter(str:string){
		return AAFilter.searchFilter(str);
	}
	get selectedFilter():string{
		return '';
	}
	set selectedFilter(s:string){
		this.layer.addFilter(s);
	}
	remove(index:number){
		this.layer.removeFilter(index);
		this.$forceUpdate()
	}
	up(index:number){
		this.layer.upFilter(index);
		this.$forceUpdate()
	}
	down(index:number){
		this.layer.downFilter(index);
		this.$forceUpdate();
	}
}
</script>

<style lang="scss" scoped>
@import '../../styles/_variables.scss';
a{
	cursor:pointer;
}
</style>
