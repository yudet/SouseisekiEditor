
<template lang="pug">
	nav.navbar.navbar-light.bg-faded
		.form-inline
			.btn-group
				button.btn.btn-sm.align-middle(@click='openFile',:title='t("open-file")',data-toggle='tooltip',v-shortkey='shortkeys.openFile',@shortkey='openFile')
					i.fa.fa-folder-open
				button.btn.btn-sm.align-middle(@click='saveFile',:title='t("save-file")',data-toggle='tooltip',v-shortkey='shortkeys.saveFile',@shortkey='saveFile')
					i.fa.fa-save
				button.btn.btn-sm.align-middle(@click='importFile',:title='t("import-file")',data-toggle='tooltip')
					i.fa.fa-caret-square-o-left
				button.btn.btn-sm.align-middle(@click='exportFile',:title='t("export-file")',data-toggle='tooltip',v-shortkey='shortkeys.exportFile',@shortkey='exportFile')
					i.fa.fa-file-text
			.btn-group
				button.btn.btn-sm.align-middle(@click='startMltBrowser',:title='t("mlt-browser")',data-toggle='tooltip',v-shortkey='shortkeys.startMltBrowser',@shortkey='startMltBrowser')
					i.fa.fa-film
			.btn-group
				button.btn.btn-sm.align-middle(@click='toggleHighlight',:title='t("highlight-toggle")',data-toggle='tooltip',v-shortkey='shortkeys.toggleHighlight',@shortkey='toggleHighlight')
					i.fa.fa-paint-brush(:class='{ "text-muted":!state.isHighlight }')

</template>

<script lang="ts">
import Vue from 'vue';
import JQuery from 'jquery';
import Component from 'vue-class-component';
import fs from 'fs';
import * as localforage from 'localforage';
import {ipcRenderer} from 'electron';
import * as iconv from 'iconv-lite';
import * as path from 'path';
import * as settings from 'electron-settings';

import Util from '../util';
import Dialogs from '../dialog';
import ConfigManager from '../config'

@Component({
	props:{
		state:null
	}
})
export default class Header extends Vue {
	filename:string;
	state:any;
	startMltBrowser(){
		ipcRenderer.send('RequestCreateWindow','mltbrowser');
	}
	openFile(){
		this.state.openFile();
	}
	importFile(){
		this.state.importFile();
	}
	saveFile(){
		this.state.saveFile();
	}
	exportFile(){
		this.state.exportFile();
	}
	toggleHighlight(){
		this.state.isHighlight=!this.state.isHighlight;
		localforage.setItem('highlight',this.state.isHighlight);
	}
	get shortkeys():any{
		return this.state.shortkeys;
	}
}
</script>

<style lang="sass" scoped>
@import '../../styles/_variables.scss';
.btn-group{
	background-color:transparent;
	padding-left:0.5em;
	padding-right:0.5em;
	border-left-style:solid;
	border-left-width:1px;
	border-left-color:$gray-lighter;
	&:first-child{
		border-left-style:none;
	}
}
button.btn{
	background-color:$gray-lightest;
	cursor:pointer;
	i{
		color:$black;
	}
	padding:0px 3px !important;
	&:hover{
		i.fa{
			color:$gray-dark;
		}
	}
}
</style>
