import * as localforage from 'localforage';
import Base from './base';
import Tab from './tab';
import {FileInterpreterFactory} from './file';

export default class TabsGroup extends Base{
	lowers: Array<Tab>;
	enableAddTab:boolean=true;
	constructor(o: any={}){
		super();
		if(!o.tabs){
			this.lowers=[new Tab()]
		}else{
			this.lowers=o.tabs;
		}
	}

	add(t?:Tab){
		this.lowers.push(t || new Tab());
		this.save();
	}

	close(index:number){
		if(this.lowers.length===1){
			return ;
		}
		if(this.index==index){
		}
		this.index=0;
		this.lowers.splice(index,1);
		this.save();
	}

	get text():string{
		return this.lower.text;
	}

	set text(s:string){
		this.lower.text=s;
	}

	save(){
		let tabs:Array<any>=[];
		for(let i in this.lowers){
			console.log(this.lowers);
			if(!!this.lowers[i].path){
				tabs[i]={path:this.lowers[i].path};
			}
		}
		localforage.setItem('tabs',tabs);
	}

	load():Promise<Array<Tab>>{
		return localforage.getItem('tabs').then((tabs:any)=>{
			let lowers:Array<Tab>=[new Tab()];
			if(tabs){
				for(let i in (tabs as Array<any>)){
					let path:string=null;
					if(!!(tabs as Array<any>)[i]){
						path=(tabs as Array<any>)[i].path;
					}
					console.log(path);
					lowers[i]=FileInterpreterFactory.get(path).getTab();
				}
			}
			return new Promise((resolve)=>{
				resolve(lowers);
			})
		});
	}
}
