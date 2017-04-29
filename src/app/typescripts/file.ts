import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import * as path from 'path';
import Tab from './tab';
import Scene from './scene';
import Layer from './layer';
import Util from './util';

export class FileInterpreterFactory{
	static get(path:string):FileInterpreter{
		if(!path){
			return new FileInterpreter(path);
		}
		if(path.endsWith('.mlt')){
			return new MltFileInterpreter(path);
		}
		if(path.endsWith('.ast')){
			return new AstFileInterpreter(path);
		}
		if(path.endsWith('.xaa')){
			return new XaaFileInterpreter(path);
		}
	}
}
export class FileInterpreter{
	constructor(path:string){
		this.path=path;
	}
	path:string;
	protected encoding:string;
	read():string{
		let buff:Buffer=new Buffer(fs.readFileSync(this.path,{encoding:'binary'}),'binary')
		return iconv.decode(buff, this.encoding);
	}

	getTab():Tab{
		let t:Tab=new Tab();
		return t;
	}

	save(t:Tab,p:string){
	}
}

export abstract class SjisFileInterpreter extends FileInterpreter{
	protected encoding:string='Shift_JIS';

}
export class MltFileInterpreter extends SjisFileInterpreter{
	getTab():Tab{
		let i:number=0,scenes:Scene[]=new Array();
		for(let st of this.read().split(/(?:\r\n|\r|\n)\[SPLIT\](?:\r\n|\r|\n)/g)){
			let s=new Scene();
			s.text=st.replace(/&#(x[0-9A-F]+);/g,function (match:string,p1:string):string{
				return String.fromCharCode(parseInt('0'+p1));
			});
			scenes[i]=s;
			i++;
		}
		return new Tab({scenes:scenes,name:path.basename(this.path),path:this.path});
	}

	save(t:Tab,p:string){
		const strBufs:string[]=[];
		for(let i in t.lowers){
			strBufs.push(Util.convertUtf8ToSjis(t.lowers[i].composed).replace(/\r\n|\r|\n/g,'\r\n'));
		}
		fs.writeFileSync(p,iconv.encode(strBufs.join('\r\n[SPLIT]\r\n'),this.encoding));
	}
}

export class AstFileInterpreter extends SjisFileInterpreter{
	getTab():Tab{
		let i:number=0,hs:string[]=this.getHeader(this.read()),scenes:Scene[]=new Array();
		for(let st of this.read().split(/(?:\r\n|\r|\n)?\[AA\]\[[^\]]*\](?:\r\n|\r|\n)/g)){
			if(i!=0){
				let s=new Scene();
				s.text=st.replace(/&#(x[0-9A-F]+);/g,function (match:string,p1:string):string{
					return String.fromCharCode(parseInt('0'+p1));
				});
				s.name=hs[i-1];
				scenes[i-1]=s;
			}
			i++;
		}
		return new Tab({scenes:scenes,name:path.basename(this.path),path:this.path});
	}

	getHeader(str:string):string[]{
		let a:string[]=str.match(/\[AA\]\[([^\]])*\](\r\n|\n|\r)/g);
		let names:string[]=[];
		for(let i=0;i<a.length;i++){
			names.push(a[i].slice(5,-2));
		}
		return names;
	}

	save(t:Tab,p:string){
		let strBuf:string='';
		for(let i in t.lowers){
			strBuf+='[AA]['+t.lowers[i].name+']\r\n'+Util.convertUtf8ToSjis(t.lowers[i].composed)+'\r\n';
		}
		strBuf=strBuf.replace(/\r\n|\r|\n/g,'\r\n');
		fs.writeFileSync(p,iconv.encode(strBuf,this.encoding));
	}
}

export class XaaFileInterpreter extends FileInterpreter{
	protected encoding:string='UTF-8';
	getTab():Tab{
		let tab:Tab=JSON.parse(this.read());
		let i=0;
		let scenes:Scene[]=new Array();
		for(let scene of tab.lowers){
			let s=new Scene();
			let j=0;
			for(let layer of scene.lowers){
				let l=new Layer();
				l.text=layer.text;
				l.name=layer.name;
				l.offset=layer.offset;
				s.lowers[j]=l;
				j++;
			}
			s.name=scene.name;
			s.index=scene.index;
			scenes[i]=s;
			i++;
		}
		return new Tab({scenes:scenes,name:path.basename(this.path),path:this.path});
	}

	save(t:Tab,p:string){
		t.setLastSaved();
		fs.writeFileSync(p,JSON.stringify(t));
	}
}
