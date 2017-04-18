import Base from './base.ts';
import Tab from './tab.ts';

export default class TabsGroup extends Base{
	lowers: Array<Tab>;
	enableAddTab:boolean=true;
	constructor(o: any={}){
		super();
		if(!o.tabs){
			this.lowers=[];
			this.lower=new Tab();
		}else{
			this.lowers=o.tabs;
		}
	}

	add(t?:Tab){
		this.lowers.push(t || new Tab());
	}

	get text():string{
		return this.lower.text;
	}

	set text(s:string){
		this.lower.text=s;
	}
}
