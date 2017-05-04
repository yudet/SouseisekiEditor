<template lang="pug">
form.form-group.p-2
	.d-flex.flex-row
		aa-editable.aa.col-1.line(v-model='value.ul',:editable='true')
		aa-editable.aa.col-1.line(v-model='value.uc',:editable='true')
		aa-editable.aa.col-1.line(v-model='value.ur',:editable='true')
	.d-flex.flex-row
		aa-editable.aa.col-1.line(v-model='value.ml',:editable='true')
		.col-1.aa.spacer
		aa-editable.aa.col-1.line(v-model='value.mr',:editable='true')
	.d-flex.flex-row
		aa-editable.aa.col-1.line(v-model='value.bl',:editable='true')
		aa-editable.aa.col-1.line(v-model='value.bc',:editable='true')
		aa-editable.aa.col-1.line(v-model='value.br',:editable='true')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import IpcController from '../ipcController.ts';
import {FileMlt} from '../hukutemp.ts';
import Util from '../util.ts';
@Component({
	props:{
		value:null
	},
})
export default class FilterEditor extends Vue {
	value:any;
	constructor(){
		super();
		console.log(this.value.ul);
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
