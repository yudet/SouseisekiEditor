import * as _ from 'lodash';
import Util from './util'
import {AAFilter,filters} from './filter'


export default class Layer{
	name: string;
	text: string;
	offset:{x:number,y:number};
	filters:string[]=new Array();
	getRealFilter(id:string):AAFilter{
		return AAFilter.searchFilter(id);
	};
	constructor(o: any={}){
		this.text=o.text || '';
		this.name=o.name || '';
		this.offset=o.offset || {x:0,y:0};
	}

	addFilter(s:string,n?:number){
		this.filters.splice(n || filters.length,0,s);
	}

	removeFilter(index:number){
		this.filters.splice(index,1);
	}

	swapFilters(n1:number,n2:number){
		if(n1>this.filters.length||n2>this.filters.length){
			return;
		}
		console.log(n1,n2);
		let tmp:any=this.filters[n1];
		this.filters[n1]=this.filters[n2];
		this.filters[n2]=tmp;
	}

	canDownFilter(index:number):boolean{
		return index+1<this.filters.length;
	}

	canUpFilter(index:number):boolean{
		return index-1>=0;
	}

	downFilter(index:number){
		if(!this.canDownFilter(index)){return;}
		this.swapFilters(index,index+1);
	}

	upFilter(index:number){
		if(!this.canUpFilter(index)){return;}
		this.swapFilters(index,index-1);
	}

	setLayerWithHTML(m:string){
		m = m.replace(/<br>/g , "\n");
		while(!!m.match(/<div>(.*?)<\/div>/g)){
			m = m.replace(/<div><br><\/div>/g , "\n\n");
			m = m.replace(/<div>(.*?)<\/div>/g , "\n$1");
		}
		// m = m.replace(/<div\s*[^>]*\/?>/g, "\n");
		m = m.replace(/<span\s*[^>]*\/?>/g, "\n");
		// m = m.replace(/<br\s*[^>]*\/?>/g, "\n");
		m = m.replace(/<p\s*[^>]*\/?>/g, "\n");
		m = m.replace(/<("[^"]*"|'[^']*'|[^'">])*>/g, '');
		// m = m.replace(/&.+;/g,function(match:string):string{
		// 	return _.unescape(match);
		// });
		m = m.replace(/\r/g,'')
		m = m.replace(/\n/g,'<br>')
		this.text=m;
	}

	offsetCompose(back:string,front: string):Array<string> {
		var frontArr:Array<string> = front.split(/\r\n|\r|\n/),
		backArr:Array<string> = back.split(/\r\n|\r|\n/),
		l:number = Math.max(frontArr.length, backArr.length),
		i:number;
		for (i = 0; i < l; i++) {
			//x:前のoffset
			//spSize:前のoffset部分のスペースの多さ
			let x:number = 0,
				spSize:number = 0;
			if (frontArr[i] === void 0 || frontArr[i] === '') {
				continue;
			}
			if (backArr[i] === void 0 || backArr[i] === '') {
				backArr[i] = frontArr[i];
				continue;
			}
			//文字列前のスペースをxに足した
			for (let j:number=0;j< frontArr[i].length;j++) {
				if (Util.isSpace(frontArr[i].charAt(j))) {
					spSize++;
				} else {
					break;
				}
			}

			x += Util.strWidth(frontArr[i].substr(0,spSize));
			frontArr[i] = frontArr[i].substr(spSize);

			//w:前の文字列自体の大きさ
			let w:number = Util.strWidth(frontArr[i]),
				startc:number, startw:number = 0,
				startStr:string,
				endc:number, endw:number, endStr:string, c:number = 0,
				sp1:string = '',
				sp2:string = '';
			endw = Util.strWidth(backArr[i]);

			//下が上のoffset内に完全に入る時
			if (endw <= x) {
				sp1 = Util.generateSpace(x - endw);
				backArr[i] = backArr[i] + sp1 + frontArr[i];
			} else if (x == 0 && endw <= w) {
				backArr[i] = frontArr[i];
			}
			//下の一部を上書きする時
			else if (endw <= x + w) {
				while (startw < x) {
					startw = Util.strWidth(backArr[i].slice(0, c));
					//	console.log(c, startw);
					c++;
				}
				startStr = (backArr[i].slice(0, c - 2));
				sp1 = Util.generateSpace(x - Util.strWidth(startStr));
				backArr[i] = startStr + sp1 /*ここまでx*/ + frontArr[i];
				console.log('p3');
			} 
			else{
				//文字列前
				while (startw < x) {
					startw = Util.strWidth(backArr[i].slice(0, c));
					//	console.log(c, startw);
					c++;
				}
				startc = c - 2;
				startw = Util.strWidth(backArr[i].slice(0, startc));
				if (x !== 0) {
					sp1 = Util.generateSpace(x - startw);
				}
				//console.log(startw, x - startw);
				if (startw === 0 || x === 0) {
					startStr = '';
				} else {
					startStr = backArr[i].slice(0, startc);
				}


				//文字列後
				let endp;
				endc = backArr[i].length;
				if (w === Util.strWidth(backArr[i])) {
					endp = 0;
					//	console.log('x', endp, w);
				} else {
					c = endc;
					let buf = Util.strWidth(backArr[i].slice(0, c));
					while (w+x < buf) {
						endp = w - buf;
						c--;
						buf = Util.strWidth(backArr[i].slice(0, c));
					};
					endc = c+1;
					endp = Util.strWidth(backArr[i].slice(0, endc)) - w - x;
				}
				endStr = backArr[i].slice(endc);
				sp2 = Util.generateSpace(endp);
				backArr[i] = startStr + sp1 + frontArr[i] + sp2 + endStr;
				//console.log('startStr',startStr,'sp1',sp1,'frontArr',frontArr[i],'sp2',sp2,'endStr',endStr);
			}

			c = 0;
		}

		return backArr;
	}

	fixFilters(){
		this.text=this.textWithFilters;
		this.filters=[];
	}

	get textWithFilters():string {
		let str=this.text;
		for(let f of this.filters){
			str=this.getRealFilter(f).filter(str);
		}
		return str;
	}

	get textWithOffset():string {
		var t:string = this.textWithFilters,
			o:{x:number,y:number} = this.offset,
			arr:Array<string> = t.split(/\r\n|\r|\n/),
			i:number,j:number;

		let x:number=o.x*1;
		for (i = 0; i < arr.length; i++) {
			if(arr[i]!=''){
				let str:string=arr[i];
				if(Util.isSpace(arr[i].charAt(0))){
					str=str.replace(/^\s+/g,(match)=>{
						x+=Util.strWidth(match);
						return '';
					});
				}else{
				}
				if(x>0){
					arr[i] = Util.generateSpace(x) + str;
				}else if(x<0){
					let tmp:string=arr[i];
					j=0;
					let w:number=x + Util.strWidth(tmp) - Util.strWidth(arr[i]);
					while(w < 0 && arr[i]!==''){
						arr[i]=arr[i].slice(1);
						w=x + Util.strWidth(tmp) - Util.strWidth(arr[i]);
					}
					arr[i]=Util.generateSpace(w)+arr[i];
				}
			}
		}

		for (i = 0; i < -o.y; i++) {
			arr=arr.slice(1);
		}
		for (i = 0; i < o.y; i++) {
			arr.unshift('');
		}

		return arr.join('\n');
	}

	compose(front:Layer):string {
		let text = this.textWithOffset;
		let str = this.offsetCompose(text,front.textWithOffset)
		return str.join('\n');
	}
}
