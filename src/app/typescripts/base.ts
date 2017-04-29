import * as Vue from 'vue';

export default class Base {
	name: string;
	lowers: Array<any>;
	index: number;
	constructor(o: any={}){
		this.name=o.name || '';
		this.index=o.index || 0;
	};

	set lower(l:any){
		this.lowers[this.index] = l;
	}

	get lower():any{
		return (this.lowers[this.index]||this.lowers[0]);
	}

	swap(n1:number,n2:number){
		if(n1>this.lowers.length||n2>this.lowers.length){
			return;
		}
		let tmp:any=this.lowers[n1];
		this.lowers[n1]=this.lowers[n2];
		this.lowers[n2]=tmp;
	}

	canDown():boolean{
		return this.index+1<this.lowers.length;
	}

	canUp():boolean{
		return this.index-1>=0;
	}

	down(){
		if(!this.canDown()){return;}
		this.swap(this.index,this.index+1);
		this.index++;
	}

	up(){
		if(!this.canUp()){return;}
		this.swap(this.index,this.index-1);
		this.index--;
	}


	add(l?:any,n?:number){
		this.lowers.splice(n || null,0,l || null);
	}

	next(){
		if(this.index+1<this.lowers.length){
			this.index++;
		}
	}

	prev(){
		if(this.index-1>=0){
			this.index--;
		}
	}

	close(index: number):void{
		if(this.lowers.length===1){
			return ;
		}
		if(this.index!=0){
			this.index=0;
		}else{
			this.index=1;
		}
		this.lowers.splice(index,1);
		return ;
	}
}
