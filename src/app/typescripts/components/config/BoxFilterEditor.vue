<template lang="pug">
form.form-group.p-2
	.d-flex.flex-row
		aa-editable.aa.col-1.line(:value='value.ul',@input='onInput($event,"ul")',:editable='true')
		aa-editable.aa.col-1.line(:value='value.uc',@input='onInput($event,"uc")',:editable='true')
		aa-editable.aa.col-1.line(:value='value.ur',@input='onInput($event,"ur")',:editable='true')
	.d-flex.flex-row
		aa-editable.aa.col-1.line(:value='value.ml',@input='onInput($event,"ml")',:editable='true')
		.col-1.aa.spacer
		aa-editable.aa.col-1.line(:value='value.mr',@input='onInput($event,"mr")',:editable='true')
	.d-flex.flex-row
		aa-editable.aa.col-1.line(:value='value.bl',@input='onInput($event,"bl")',:editable='true')
		aa-editable.aa.col-1.line(:value='value.bc',@input='onInput($event,"bc")',:editable='true')
		aa-editable.aa.col-1.line(:value='value.br',@input='onInput($event,"br")',:editable='true')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import IpcController from '../../ipcController.ts';
import {FileMlt} from '../../hukutemp.ts';
import Util from '../../util.ts';
@Component({
	props:{
		value:null
	},
})
export default class BoxFilterEditor extends Vue {
	value:any;
	constructor(){
		super();
	}
	onInput(e:any,target:string){
		this.value[target]=e;
		this.$emit('input',this.value);
	}
}
</script>

<style lang="sass" scoped>
@import '../../../styles/_variables.scss';
.line{
	height:20px;
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
