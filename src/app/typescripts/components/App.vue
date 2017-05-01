<template lang="pug">
div.app.d-flex.flex-column
	header-bar.p-2(:state='state')
	main-tabs-and-page.p-2(:state='state')
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import * as localforage from 'localforage';
import Dialogs from '../dialog';
import TabsGroup from '../tabsgroup';
import Tab from '../tab';
import State from '../state';
import {FileInterpreter,MltFileInterpreter,FileInterpreterFactory} from '../file';
import * as settings from 'electron-settings';


@Component({
	props:{
		state:null
	}
})
export default class App extends Vue {
	state:State=new State();
}

</script>

<style scoped>
.app{
	height:100%;
}
.modal.draggable{
	display:flex;
}
</style>
