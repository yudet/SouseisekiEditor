import Vue from 'vue';
import i18next from 'i18next';
import * as localforage from 'localforage';

import Header from './components/Header.vue';
import App from './components/App.vue';
import LayersAndEditable from './components/LayersAndEditable.vue';
import AaEditable from './components/AaEditable.vue';
import TabsAndPage from './components/TabsAndPage.vue';
import MltBrowser from './components/MltBrowser.vue';
import MltView from './components/MltView.vue';
import TreeView from './components/TreeView.vue';
import FilterSelect from './components/FilterSelect.vue';
import Config from './components/Config.vue';
import FilterEditor from './components/FilterEditor.vue';
import Tab from './tab.ts';

let en_US = require('json-loader!../../resource/lang/en_US.json');
let ja_JP = require('json-loader!../../resource/lang/ja_JP.json');

import '../styles/bootstrap.scss';
import '../styles/style.scss';

var t:Array<Tab>=[
	new Tab({name:'新しいタブ'}),
	new Tab({name:'新しいタブ'}),
];

class MainTabsAndPage extends TabsAndPage{
	tabs:Tab[]=t;
}

Vue.config.silent = false;
Vue.config.devtools = false;
localforage.setDriver(localforage.LOCALSTORAGE);

Vue.component('app',App);
Vue.component('layers-and-editable',LayersAndEditable);
Vue.component('main-tabs-and-page',TabsAndPage);
Vue.component('aa-editable',AaEditable);
Vue.component('header-bar',Header);

Vue.component('mlt-browser',MltBrowser);
Vue.component('mlt-view',MltView);
Vue.component('tree-view',TreeView);

Vue.component('config',Config);
Vue.component('filter-editor',FilterEditor);

Vue.component('filter-select',FilterSelect);

let vm:Vue;
Vue.use(require('vue-shortkey'))
i18next.init({
	lng: 'ja',
	resources: {
		en: en_US,
		ja: ja_JP,
	}
});
Vue.mixin({
	methods:{
		t: (str) => {
			return i18next.t(str);
		}
	}
})
if($('#app').length){
	vm = new Vue({
		el: '#app',
		render:(h)=>h(App)
	});
} else if($('#mlt-browser').length){
	vm = new Vue({
		el: '#mlt-browser',
		render:(h)=>h(MltBrowser)
	});
} else if($('#config').length){
	vm = new Vue({
		el: '#config',
		render:(h)=>h(Config)
	});
}
