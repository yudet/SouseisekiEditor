<template lang="pug">
ul.tree-view
	li.element(v-for='(e,index) in list')
		span.directory(v-if='!!e.isDirectory')
			i.fa.fa-folder(v-if='!e.isOpen')
			i.fa.fa-folder-open(v-if='!!e.isOpen')
			span.file-name(@click='openDir(e)') {{ e.title }}
			tree-view.p-2(:list='e.contents',v-if='!!e.isDirectory && e.isOpen',:state='state',@dirOpen='$emit("dirOpen")')
		span.file(v-if='!e.isDirectory')
			span.file-name(@click='clickFileName(e)') {{ e.title }}
</template>

<script lang="ts">
import Vue from 'vue';
import Component from 'vue-class-component';
import {FileMlt,DirectoryMlt} from '../hukutemp';
@Component({
	props:{
		list:Array,
		state:null
	},
})
export default class TreeView extends Vue {
	list:Array<any>;
	selection:any;
	title:string;
	state:any;
	constructor(){
		super();
	}
	clickFileName(e:FileMlt){
		this.state.getFileMlt(e);
	}
	openDir(e:DirectoryMlt){
		e.isOpen=!e.isOpen
		this.$emit('dirOpen');
	}
}

</script>

<style lang="sass" scoped>

.tree-view{
	font-size:10px;
	padding:0px!important;
	padding-left:5px!important;
}
.element{
	list-style-type:none;
}
.file-name{
	cursor:pointer;
}
//	padding:1px!important;
//}

</style>
