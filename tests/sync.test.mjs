import test from 'node:test';
import assert from 'node:assert/strict';
import {recoverProgress} from '../lib/sync.ts';
const valid=x=>!!x&&typeof x.name==='string';
test('unsent local progress resumes only against its original cloud revision',()=>{
 const remote={name:'remote'},local={name:'local'};
 assert.deepEqual(recoverProgress(remote,4,{data:local,revision:4,dirty:true},valid),{data:local,conflict:false});
 assert.deepEqual(recoverProgress(remote,5,{data:local,revision:4,dirty:true},valid),{data:local,conflict:true});
});
test('explicit reload discards local work; clean or malformed caches never replace cloud',()=>{
 const remote={name:'remote'},local={name:'local'};
 for(const cache of [null,{data:null,dirty:true},{data:local,revision:3,dirty:false}])assert.equal(recoverProgress(remote,4,cache,valid).data,remote);
 assert.equal(recoverProgress(remote,4,{data:local,revision:3,dirty:true},valid,true).data,remote);
});
