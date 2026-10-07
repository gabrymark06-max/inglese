import test from 'node:test';
import assert from 'node:assert/strict';
import {Rating,createEmptyCard} from 'ts-fsrs';
import {initial,rate,serialize,restore,dueWords,validProgress,streak,dateKey} from '../lib/learning.ts';
test('FSRS survives JSON export, restore, and the next review',()=>{
 const now=new Date('2026-10-08T10:00:00Z');
 const card=rate(undefined,Rating.Good,now);
 const saved=JSON.parse(JSON.stringify({...initial,cards:{hello:card}}));
 assert.equal(validProgress(saved),true);
 assert.ok(restore(saved.cards.hello).due instanceof Date);
 assert.equal(dueWords(saved,now).length,0);
 const due=new Date(card.due);assert.deepEqual(dueWords(saved,due),['hello']);
 const next=rate(saved.cards.hello,Rating.Again,due);assert.equal(next.reps,2);assert.ok(Date.parse(next.due)>=due.getTime());
});
test('unfinished words are immediately due and malformed backups are rejected',()=>{
 const card=serialize(createEmptyCard(new Date('2026-10-08T10:00:00Z')));
 const valid={...initial,cards:{hello:card}};assert.equal(validProgress(valid),true);
 assert.deepEqual(dueWords(valid,new Date('2026-10-08T11:00:00Z')),['hello']);
 for(const value of [null,{...initial,cards:{hello:null}},{...valid,cards:{hello:{...card,due:'invalid'}}},{...valid,cards:{hello:{...card,learning_steps:undefined}}},{...initial,activity:{'2026-10-08':null}},{...initial,errors:[null]},{...initial,goal:-1}])assert.equal(validProgress(value),false);
});
test('streak includes yesterday, crosses month boundaries, and breaks after a gap',()=>{
 const d=new Date(),y=new Date(d);y.setDate(y.getDate()-1);const before=new Date(d);before.setDate(before.getDate()-2);
 const a={[dateKey(y)]:{tasks:1,minutes:5},[dateKey(before)]:{tasks:1,minutes:2}};
 assert.equal(streak(a),2);assert.equal(streak({...a,[dateKey(d)]:{tasks:1,minutes:4}}),3);assert.equal(streak({[dateKey(before)]:{tasks:1,minutes:4}}),0);
});
