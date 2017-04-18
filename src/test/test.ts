import {AASupplier,YaruyomiSupplier} from '../app/typescripts/hukutemp';
import {MltFileInterpreter,FileInterpreter,AstFileInterpreter} from '../app/typescripts/file';
import {AAFilter,BoxAAFilter,filters} from '../app/typescripts/filter';
import Util from '../app/typescripts/util';

import * as path from 'path';
import * as fs from 'fs';
import * as iconv from 'iconv-lite';

import * as chai from 'chai';
import * as sinon from 'sinon';
import 'mocha';

const sjis:{[key:string]:number} = require('../../src/test/sjis.json');

describe('file',()=>{
	it('mlt',()=>{
		const interpreter:MltFileInterpreter=new MltFileInterpreter('./');
		const str:String=interpreter.convertUtf8ToSjis('あ'+String.fromCharCode(0x2003)+'a?');
		chai.expect(str).to.eql('あ&#x2003;a?');
	});
	it('ast',()=>{
		const interpreter:AstFileInterpreter=new AstFileInterpreter('./');
		const str:string[]=interpreter.getHeader('[AA][a]\n\n[AA][]\nあ');
		chai.expect(str).to.eql(['a','']);
	});
});
describe('filter',()=>{
	let stub = sinon.stub(Util, 'strWidth',
			(str:string)=>{
				return sjis[str];
			})
	it('simple-box',()=>{
		console.log(filters.keys())
	});
});
describe('util',()=>{
	it('generate-space',()=>{
		let r:string=''
		for(let i=0;i<320;i++){
			r=Util.generateSpace(i)
			if(r.match(/$ /)||r.match(/\ \ /)){
				console.log('"'+r+'"',i);
			}
		}
	});
});


// 
