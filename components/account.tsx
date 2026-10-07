'use client';
import {useState,useEffect,useRef,type Dispatch,type SetStateAction} from 'react';
import type {User} from '@supabase/supabase-js';
import {Cloud,LogIn,LogOut,X,Mail,ShieldCheck} from 'lucide-react';
import {recoverProgress} from '../lib/sync';
import {getSupabase} from '../lib/supabase';
import {initial,validProgress,type Progress} from '../lib/learning';

export function useAccount(p:Progress,setP:Dispatch<SetStateAction<Progress>>,ready:boolean){
 const [user,setUser]=useState<User|null>(null),[resolved,setResolved]=useState(false),[status,setStatus]=useState('Progressi su questo dispositivo'),[blocked,setBlocked]=useState(false);
 const generation=useRef(0),revision=useRef(0),baseline=useRef(''),loaded=useRef(false),saving=useRef(false),latest=useRef(p),activeUser=useRef<string|null>(null);latest.current=p;
 const [retry,setRetry]=useState(0);
 useEffect(()=>{
  if(!ready)return;const db=getSupabase();
  if(!db){setResolved(true);return;}
  const load=async(u:User|null)=>{
   const id=++generation.current;activeUser.current=u?.id||null;loaded.current=false;setResolved(false);setUser(u);setBlocked(false);
   if(!u){try{const raw=localStorage.getItem('parla-progress-v1');setP(raw&&validProgress(JSON.parse(raw))?JSON.parse(raw):initial);}catch{setP(initial);}setStatus('Progressi su questo dispositivo');setResolved(true);return;}
   setStatus('Caricamento dei progressi…');
   const {data,error}=await db.from('learning_progress').select('data,revision').eq('user_id',u.id).maybeSingle();
   if(id!==generation.current)return;
   if(error||data&&!validProgress(data.data)){let cached={...initial,onboarded:true};try{const raw=localStorage.getItem(`parla-account-${u.id}`);const copy=raw?JSON.parse(raw):null;if(copy&&validProgress(copy.data))cached=copy.data;}catch{}setP(cached);setBlocked(true);setStatus('Cloud non disponibile. Esporta le modifiche locali prima di ricaricare.');setResolved(true);return;}
   const next:Progress=data?.data||{...initial,name:u.user_metadata?.full_name?.slice(0,80)||'',onboarded:true};
   revision.current=data?.revision||0;baseline.current=JSON.stringify(next);let chosen=next;let conflict=false;try{const raw=localStorage.getItem(`parla-account-${u.id}`);const copy=raw?JSON.parse(raw):null;const recovered=recoverProgress(next,revision.current,copy,validProgress,retry>0);chosen=recovered.data;conflict=recovered.conflict;}catch{}setP(chosen);loaded.current=true;setBlocked(conflict);setStatus(conflict?'Copia locale da recuperare: esportala prima di ricaricare il cloud.':'Progressi sincronizzati');setResolved(true);
  };
  db.auth.getSession().then(({data})=>load(data.session?.user||null));
  const {data:subscription}=db.auth.onAuthStateChange((event,session)=>{if(event==='SIGNED_OUT'||event==='SIGNED_IN'&&session?.user.id!==activeUser.current)setTimeout(()=>load(session?.user||null),0);});
  return()=>{generation.current++;subscription.subscription.unsubscribe();};
 },[ready,retry,setP]);
 useEffect(()=>{
  if(!ready||!resolved)return;
  if(!user){if(p.onboarded)try{localStorage.setItem('parla-progress-v1',JSON.stringify(p));}catch{setStatus('Memoria locale non disponibile: esporta una copia.');}return;}
  const serialized=JSON.stringify(p);try{localStorage.setItem(`parla-account-${user.id}`,JSON.stringify({data:p,revision:revision.current,dirty:serialized!==baseline.current}));}catch{setStatus('Copia locale non disponibile: esporta i progressi.');}
  if(!loaded.current||blocked)return;
  if(serialized===baseline.current)return;
  setStatus('Modifiche da sincronizzare…');
  const tick=setInterval(async()=>{
   if(saving.current||blocked)return;const current=JSON.stringify(latest.current);if(current===baseline.current)return;
   saving.current=true;const id=generation.current;
   const {data,error}=await getSupabase()!.rpc('save_learning_progress',{payload:latest.current,expected_revision:revision.current});
   saving.current=false;if(id!==generation.current)return;
   if(error){setStatus(error.message.includes('PROGRESS_CONFLICT')?'Un altro dispositivo ha aggiornato i progressi. Esporta questa copia e ricarica il cloud.':'Salvataggio non riuscito. La copia locale è conservata: riprova.');setBlocked(true);}
   else{revision.current=Number(data);baseline.current=current;try{localStorage.setItem(`parla-account-${user.id}`,JSON.stringify({data:latest.current,revision:revision.current,dirty:JSON.stringify(latest.current)!==current}));}catch{}setStatus('Progressi sincronizzati');}
  },1200);
  return()=>clearInterval(tick);
 },[p,ready,resolved,user,blocked]);
 return {user,status,blocked,loading:!resolved,reload:()=>setRetry(n=>n+1),logout:async(force=false)=>{if(saving.current){setStatus('Salvataggio in corso. Attendi e riprova a uscire.');return;}if(!force&&user&&JSON.stringify(latest.current)!==baseline.current){setStatus('Prima di uscire attendi la sincronizzazione oppure esporta una copia.');return;}const result=await getSupabase()?.auth.signOut({scope:'local'});if(result?.error)setStatus('Uscita non riuscita. Riprova.');},importGuest:()=>{try{const raw=localStorage.getItem('parla-progress-v1');if(raw&&validProgress(JSON.parse(raw)))setP(JSON.parse(raw));else setStatus('Nessuna copia ospite disponibile.');}catch{setStatus('Copia ospite non leggibile.');}}};
}
function latestBackup(id:string){try{const raw=localStorage.getItem(`parla-account-${id}`);return raw?JSON.parse(raw).data:initial;}catch{return initial;}}
export function AccountPanel({account,onClose}:{account:ReturnType<typeof useAccount>;onClose:()=>void}){
 const [email,setEmail]=useState(''),[busy,setBusy]=useState(false),[message,setMessage]=useState(''),[confirm,setConfirm]=useState(false);const configured=!!getSupabase();
 useEffect(()=>{const previous=document.activeElement as HTMLElement|null;const listener=(e:KeyboardEvent)=>{if(e.key==='Escape')onClose();if(e.key==='Tab'){const nodes=Array.from(document.querySelectorAll<HTMLElement>('.account-modal button:not(:disabled),.account-modal input:not(:disabled)'));const first=nodes[0],last=nodes[nodes.length-1];if(e.shiftKey&&document.activeElement===first){e.preventDefault();last?.focus();}else if(!e.shiftKey&&document.activeElement===last){e.preventDefault();first?.focus();}}};window.addEventListener('keydown',listener);return()=>{window.removeEventListener('keydown',listener);previous?.focus();};},[onClose]);
 const login=async(google=false)=>{setBusy(true);setMessage('');try{const db=getSupabase();if(!db)return;const redirectTo=window.location.origin+'/';const {error}=google?await db.auth.signInWithOAuth({provider:'google',options:{redirectTo}}):await db.auth.signInWithOtp({email,options:{emailRedirectTo:redirectTo}});setMessage(error?'Accesso non riuscito. Controlla l’indirizzo e riprova.':google?'Apertura di Google…':'Controlla la tua email: ti abbiamo inviato un link per accedere.');}catch{setMessage('Connessione non disponibile. Riprova.');}finally{setBusy(false);}};
 return <div className="modal-backdrop"><section className="account-modal" role="dialog" aria-modal="true" aria-labelledby="account-title"><div className="account-modal-top"><span className="account-symbol"><Cloud size={25}/></span><button autoFocus className="icon-button" onClick={onClose} aria-label="Chiudi account"><X/></button></div><p className="eyebrow">IL TUO INGLESE, OVUNQUE</p><h2 id="account-title">{account.user?'Il tuo account.':'Un percorso che resta tuo.'}</h2>{account.user?<><p className="account-email">{account.user.email}</p><p role="status">{account.status}</p><button className="button secondary" onClick={account.reload}>Ricarica dal cloud</button><p>Hai studiato prima di accedere? Puoi trasferire la copia ospite di questo dispositivo.</p>{confirm?<div className="warning">Questa operazione sostituisce i progressi dell’account con la copia ospite. Esporta prima una copia nelle impostazioni.<button className="button" onClick={()=>{account.importGuest();setConfirm(false);}}>Conferma trasferimento</button><button className="text-button" onClick={()=>setConfirm(false)}>Annulla</button></div>:<button className="text-button" onClick={()=>setConfirm(true)}>Trasferisci progressi ospite</button>}<button className="text-button" onClick={async()=>{const url=URL.createObjectURL(new Blob([JSON.stringify(latestBackup(account.user!.id),null,2)],{type:'application/json'}));const a=document.createElement('a');a.href=url;a.download='parla-progressi-account.json';a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);await account.logout(true);}}>Esporta copia locale ed esci</button><button className="button secondary" disabled={busy} onClick={async()=>{setBusy(true);await account.logout();setBusy(false);}}><LogOut size={18}/>Esci dall’account</button></>:<><p>Salva parole, lezioni e abitudini nel tuo account e ritrovale quando cambi dispositivo.</p>{!configured&&<div className="auth-unavailable" role="status"><ShieldCheck size={21}/><div><strong>Gli account saranno disponibili a breve.</strong><p>Il servizio di accesso deve essere attivato. Intanto puoi studiare: i progressi rimangono salvati su questo dispositivo.</p></div></div>}<button disabled={!configured||busy} className="google-button" onClick={()=>login(true)}><span className="google-g">G</span>Continua con Google</button><div className="auth-divider">oppure con la tua email</div><form onSubmit={e=>{e.preventDefault();login();}}><label>Email<input type="email" autoComplete="email" placeholder="nome@esempio.it" required value={email} onChange={e=>setEmail(e.target.value)} disabled={!configured||busy}/></label><button className="button" disabled={!configured||busy}><Mail size={18}/>{busy?'Invio in corso…':'Inviami un link di accesso'}</button></form><small>Nessuna password da ricordare. Il primo accesso crea il tuo account. Email e progressi vengono gestiti da Supabase quando il servizio è attivo.</small></>}{message&&<p className="feedback" role="status">{message}</p>}</section></div>;
}
export function AccountButton({account,onClick}:{account:ReturnType<typeof useAccount>;onClick:()=>void}){return <button className="account-button" onClick={onClick}><span>{account.user?<Cloud size={17}/>:<LogIn size={17}/>}</span>{account.user?'Account':'Accedi'}</button>;}
