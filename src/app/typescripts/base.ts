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
		return this.lowers[this.index];
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

	close(index: number):void{
		if(this.lowers.length===1){
			return ;
		}
		if(this.index==index){
		}
		this.index=0;
		this.lowers.splice(index,1);
		return ;
	}
}
