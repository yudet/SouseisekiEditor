import Base from './base'
import Layer from './layer'

export default class Scene extends Base {
	lowers: Array<Layer>;
	constructor(o: any={}){
		super();
		if(!o.layers){
			this.lowers=[];
			this.lower=new Layer();
		}else{
			this.lowers=o.layers;
		}
	};

	add(l?:Layer){
		this.lowers.splice(this.index+1,0,l || new Layer());
	}

	get composed():string{
		let res:Layer=new Layer();
		for(let i:number=0;i<this.lowers.length;i++){
			res.text = res.compose(this.lowers[i]);
		}
		return res.text;
	}
	get text():string{
		return this.lower.text;
	}

	set text(s:string){
		this.lower.text=s;
	}
}
