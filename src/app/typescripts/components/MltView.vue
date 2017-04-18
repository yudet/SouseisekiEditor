<template lang="pug">
.d-flex.flex-column.mlt-view
	div.aa(v-for='(aa,index) in aas',:class='{ even:isEven(index) }',@click='sendAA(aa)') {{aa}}
</template>

<script lang="ts">
import Vue from 'vue';
import IpcController from '../ipcController.ts';
import Component from 'vue-class-component';
import {FileMlt} from '../hukutemp.ts';
@Component({
	props:{
		mlt:FileMlt,
		aas:[],
		state:null
	},
})
export default class MltBrowser extends Vue {
	private pmlt:FileMlt
	get aas():Array<string>{
		return this.state.aas;
	}
	isEven(n:number):boolean{
		return n % 2 == 0;
	}
	state:any;
	sendAA(aa:string){
		console.log(aa);
		IpcController.sendAA(aa);
	}
	constructor(){
		super();
	}
}

</script>

<style lang="sass" scoped>
.mlt-browser{
height:100%;
overflow:scroll;
}
.aa{
	cursor:pointer;
	white-space:pre;
	&.even{
		background-color:#DDD;
	}
}
</style>
