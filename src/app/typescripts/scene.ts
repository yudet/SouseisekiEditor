import Base from './base';
import Layer from './layer';
import Util from './util';

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
		return res.text.replace(/[\u0020\u00a0\u200a\u2009\u2006\u2005\u2002\u2007\u3000]+/g,(match)=>{
			let r=Util.generateSpace(Util.strWidth(match));
			if(r.match(/\u0020\u0020/)){
				console.log(r.replace(/ /g,'H').replace(/　/g,'Z'),Util.strWidth(match))
			}
			return r;
		});
		// return res.text;
	}
	get text():string{
		return this.lower.text;
	}

	set text(s:string){
		this.lower.text=s;
	}
}
