import {createEmptyCard,fsrs,Rating,type Card} from 'ts-fsrs';
export const scheduler=fsrs({request_retention:0.9,enable_fuzz:false});
export type SavedCard=Omit<Card,'due'|'last_review'> & {due:string;last_review?:string};
export type Progress={version:1;name:string;level:string;goal:number;onboarded:boolean;cards:Record<string,SavedCard>;known:string[];completed:string[];activity:Record<string,{tasks:number;minutes:number}>;errors:{original:string;corrected:string}[];encounters:Record<string,number>};
export const initial:Progress={version:1,name:'',level:'A1',goal:20,onboarded:false,cards:{},known:[],completed:[],activity:{},errors:[],encounters:{}};
export const dateKey=(d=new Date())=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
export function serialize(card:Card):SavedCard{return {...card,due:card.due.toISOString(),last_review:card.last_review?.toISOString()};}
export function restore(card:SavedCard):Card{return {...card,due:new Date(card.due),last_review:card.last_review?new Date(card.last_review):undefined};}
export function rate(card:SavedCard|undefined,rating:Rating,now=new Date()){return serialize(scheduler.next(card?restore(card):createEmptyCard(now),now,rating === Rating.Manual ? Rating.Again : rating).card);}
export function dueWords(p:Progress,now=new Date()){return Object.keys(p.cards).filter(w=>new Date(p.cards[w].due)<=now);}
export function streak(activity:Progress['activity']){let count=0;const d=new Date();if(!activity[dateKey(d)])d.setDate(d.getDate()-1);while(activity[dateKey(d)]?.tasks){count++;d.setDate(d.getDate()-1);}return count;}
export const normalize=(s:string)=>s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/[^a-z0-9' ]/g,'').replace(/\s+/g,' ').trim();
const isObject=(v:unknown):v is Record<string,unknown>=>!!v&&typeof v==='object'&&!Array.isArray(v);
export function validProgress(x:unknown):x is Progress {
 if(!isObject(x))return false;
 const p=x as unknown as Progress;
 if(p.version!==1||typeof p.name!=='string'||p.name.length>80||!['A1','A2','B1','B2'].includes(p.level)||![10,20,30].includes(p.goal)||typeof p.onboarded!=='boolean')return false;
 if(!Array.isArray(p.known)||!p.known.every(w=>typeof w==='string'&&w.length<=1000)||!Array.isArray(p.completed)||!p.completed.every(w=>typeof w==='string')||!Array.isArray(p.errors)||!p.errors.every(e=>isObject(e)&&typeof e.original==='string'&&typeof e.corrected==='string'))return false;
 if(!isObject(p.activity)||!Object.entries(p.activity).every(([d,a])=>/^\d{4}-\d{2}-\d{2}$/.test(d)&&isObject(a)&&typeof a.tasks==='number'&&Number.isInteger(a.tasks)&&a.tasks>=0&&typeof a.minutes==='number'&&Number.isFinite(a.minutes)&&a.minutes>=0))return false;
 if(!isObject(p.encounters)||!Object.values(p.encounters).every(n=>typeof n==='number'&&Number.isInteger(n)&&n>=0)||!isObject(p.cards))return false;
 return Object.values(x.cards as Record<string,unknown>).every(c=>isObject(c)&&typeof c.due==='string'&&Number.isFinite(Date.parse(c.due))&&[0,1,2,3].includes(c.state as number)&&['stability','difficulty','elapsed_days','scheduled_days','learning_steps','reps','lapses'].every(k=>typeof c[k]==='number'&&Number.isFinite(c[k])&&(c[k] as number)>=0)&&(!c.last_review||(typeof c.last_review==='string'&&Number.isFinite(Date.parse(c.last_review)))));
}



