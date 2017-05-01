import Util from './util';
import {t} from 'i18next';
export class AAFilter{
	filter(str:string):string{
		return str;
	}
	get name():string{
		return t('filter-'+this.id);
	}
	id:string;
	static searchFilter(id:string):AAFilter{
		return filters.filter((el:any)=>{
			return el.id===id
		})[0];
	}
}
export interface BoxLines{
	ul:string,uc:string,ur:string,
		ml:string,mr:string,
		bl:string,bc:string,br:string
}
export class BoxAAFilter extends AAFilter{
	lines:BoxLines={ul:'┌',uc:'─',ur:'┐',
		ml:'│',mr:'│',
		bl:'└',bc:'─',br:'┘'}
	id:string='simple-box';
	constructor(){
		super();
	}
	filter(str:string):string{
		let strs:string[]=str.split(/\r\n|\r|\n/),result:string[]=new Array();
		let maxWidth:number=Util.strWidth(str);
		const nLines:number=Math.floor(maxWidth / Util.strWidth(this.lines.uc) + 1);
		maxWidth=nLines*Util.strWidth(this.lines.uc);
		result.push(this.lines.ul+this.lines.uc.repeat(nLines)+this.lines.ur);
		for(let s of strs){
			let gap=maxWidth - Util.strWidth(s);
			result.push(this.lines.ml + s + Util.generateSpace(gap) + this.lines.mr);
		}
		result.push(this.lines.bl+this.lines.bc.repeat(nLines)+this.lines.br);
		return result.join('\n');
	}
}

export class OtherAAFilter extends AAFilter{
	id:string='simple-box';
	f:Function;
	constructor(s:string){
		super();
		this.f=Function(`return function(str,Util){${s}};`)();
	}
	filter(str:string):string{
		return this.f(str,Util);
	}
}

export const filters:AAFilter[]=[
];

