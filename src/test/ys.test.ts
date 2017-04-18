import * as fs from 'fs';
import * as iconv from 'iconv-lite';
import {AASupplier,YaruyomiSupplier,YaruyomiFileMlt} from '../app/typescripts/hukutemp';
import {AAFilter,BoxAAFilter} from '../app/typescripts/filter';
import * as File from '../app/typescripts/file';

let ys:AASupplier = new YaruyomiSupplier('v21.3');
let d:any;
ys.getAAList().then((data)=> {
	if(!fs.statSync('./cache').isDirectory()){
		fs.mkdirSync('./cache')
	};
	fs.writeFileSync('./cache/data.json', JSON.stringify(data));
	d=data;
}).then(()=>{
	return ys.getAAList()
}).then((data)=>{
	console.log(data[0]===d[0]);
}).then(()=>{
	for(let i=0;i<d[0].contents.length;i++){
		if(d[0].contents[i] instanceof YaruyomiFileMlt){
			d[0].contents[i].getAAs().then((d2:any)=>{
				fs.writeFileSync('./cache/d2.json', JSON.stringify(d2));
			});
			break;
		}
	}
});
