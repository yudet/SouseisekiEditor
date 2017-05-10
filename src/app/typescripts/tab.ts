import Base from './base';
import Scene from './scene'
import {t} from 'i18next';
import Dialogs from './dialog';

export default class Tab extends Base{
	lowers: Array<Scene>;
	path:string;
	isEdited:boolean=false;
	constructor(o: any={}){
		super();
		if(!o.name){
			this.name=t('new-tab');
		}else{
			this.name=o.name;
		}
		if(!o.scenes){
			this.lowers=[];
			this.lower=new Scene();
		}else{
			this.lowers=o.scenes;
		}
		this.path=o.path||'';
	}

	add(s?:Scene){
		this.lowers.push(s || new Scene());
	}

	get text():string{
		return this.lower.text;
	}

	set text(s:string){
		this.lower.text=s;
	}
	isCloseLocalforageId:string='never-ask-close-scene';
	closeMessaging():number{
		return Dialogs.messageCloseScene();
	}
}
