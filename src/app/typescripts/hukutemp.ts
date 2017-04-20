import axios from 'axios';
import * as localforage from 'localforage';

export abstract class AASupplier {
	public id:string;
	public abstract getAAList():Promise<any>
}

export class YaruyomiSupplier extends AASupplier{
	private version:string;
	private aaList:Array<Mlt>=null;
	constructor(version:string){
		super();
		this.version=version;
	}
	get id():string{
		return 'Yaruyomi-'+this.version;
	}
	private loadYaruyomi(o:any):Mlt{
		if(o.h==null){
			// directory
			let c=o.c;
			for(let i=0;i<c.length;i++){
				c[i]=this.loadYaruyomi(c[i]);
			}
			return new YaruyomiDirectoryMlt(o.f,c,this.version,o.s);
		} else{
			// file
			return new YaruyomiFileMlt(o.f,o.h,this.version,o.s);
		}
	}
	public getAAList():any{
		if(this.aaList == null){
			return axios.get(`http://aa.yaruyomi.com/api.php?mode=list&version=${this.version}`)
				.then((res:any)=>{
					return new Promise((resolve:Function)=>{
						let a=res.data;
						for(let i=0;i<a.length;i++){
							a[i]=this.loadYaruyomi(a[i]);
						}
						this.aaList=a;
						// console.log(a);
						resolve(this.aaList);
					});
				});
		} else {
			return new Promise((resolve:Function)=>{
				resolve(this.aaList);
			});
		}

	}
}

export abstract class Mlt {
	protected title:string;
	protected version:string;
	protected isNew:boolean;
}

export abstract class FileMlt extends Mlt {
	public mltType:string;
	protected aas:Array<string>=new Array<string>();
	protected isUpdated:boolean;
	protected isLoaded:boolean=false;
	public isDirectory:boolean=false;
	public getAAs():Promise<Array<string>>{
		return new Promise((resolve:Function)=>{
			resolve(this.aas)
		});
	};
}

export abstract class DirectoryMlt extends Mlt {
	protected contents:Array<Mlt>;
	public isOpen:boolean=false;
	public isDirectory:boolean=true;
}

export class YaruyomiFileMlt extends FileMlt{
	protected id:string;
	constructor(title:string, id:string, version:string, state?:string){
		super();
		this.title=title;
		this.version=version;
		this.id=id;
		this.isNew=state.indexOf('n')!=-1;
		this.isUpdated=state.indexOf('u')!=-1;
		this.mltType='yaruyomi';
	}
	public getAAs():any{
		if(!this.isLoaded){
			return axios.get(`http://aa.yaruyomi.com/api.php?mode=aa&name=${this.id}&version=${this.version}`).then((data)=>{
				return new Promise((resolve:Function)=>{
					let d:string=data.data
					let a:Array<string>=d.split(/\r\n\[SPLIT\]\r\n/g);
					this.aas=a;
					this.isLoaded=true;;
					resolve(this.aas);
				});
			});
		}else{
			return new Promise((resolve:Function)=>{
				resolve(this.aas)
			});
		}
	}
}

export class YaruyomiDirectoryMlt extends DirectoryMlt{
	constructor(title:string, contents:Array<Mlt>, version:string, state?:string){
		super();
		this.title=title;
		this.version=version;
		this.isNew=state.indexOf('n')!=-1;
		this.contents=contents;
	}
}
