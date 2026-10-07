// Recover unsent local work without silently overwriting a newer remote revision.
export function recoverProgress<T>(remote:T,revision:number,cache:unknown,valid:(value:unknown)=>value is T,discard=false){
 if(discard||!cache||typeof cache!=='object')return {data:remote,conflict:false};
 const saved=cache as {data?:unknown;dirty?:unknown;revision?:unknown};
 if(saved.dirty!==true||!valid(saved.data))return {data:remote,conflict:false};
 return {data:saved.data,conflict:saved.revision!==revision};
}
