# Parla — progetto per imparare l'inglese

Repository GitHub: https://github.com/gabrymark06-max/inglese. Il progetto supporta anche Vercel tramite Next.js; configurazione e istruzioni in `VERCEL.md`.

Applicazione funzionante in `app/`, costruita con React, TypeScript e Vinext (API e struttura Next.js) per pubblicazione su Sites/Cloudflare Workers. `RICERCA.md` conserva il progetto originario; `RICERCA-AGGIORNATA.md` aggiorna le fonti; `DESIGN.md` descrive la nuova identità English studio.

## Avvio locale

Richiede Node.js 22.18+ (qui verificato con 24.19) e npm.

```powershell
cd C:\Users\Admin\Documents\jarvis\english-site\app
npm install
npm run dev
```

Anteprima: http://127.0.0.1:5173/. Su Windows, se lo shim npm del sistema fallisce, invocare `node 'C:\Program Files\nodejs\node_modules\npm\bin\npm-cli.js' install` e `node scripts/run-framework.mjs dev`.

```powershell
node node_modules/typescript/bin/tsc --noEmit
node --experimental-strip-types --test tests/learning.test.mjs
node scripts/run-framework.mjs build
```

## Funzioni consegnate

- Profilo e obiettivo giornaliero; quiz di 12 domande per un punto di partenza orientativo A1–B2.
- Sessione in cinque passi, accesso indipendente a ogni esercizio e ripasso FSRS con richiamo scritto e autovalutazione.
- 96 parole bilingui con esempi originali e sintesi vocale; 1.000 lemmi ufficiali NGSL ordinati per frequenza, ricercabili e aggiungibili al mazzo. Per le voci non curate: definizione inglese tramite Free Dictionary API, solo su richiesta.
- Sei letture originali, traduzioni, ascolto normale/lento, domanda di comprensione e dizionario delle parole. Conteggio degli incontri e familiarità basata sulle parole effettivamente ricordate; non è una misura certificata della copertura lessicale reale.
- Otto lezioni grammaticali con 32 esercizi e feedback.
- Quattro dialoghi guidati, suggerimenti e invito a riformulare. Le risposte vengono confrontate con espressioni attese; il sito dichiara il limite del controllo.
- Tutor IA server opzionale con risposte strutturate, invito all'autocorrezione e frasi corrette salvate per ripasso.
- Dettatura facoltativa dove il browser la supporta. Shadowing con registrazione locale, riascolto e download, senza punteggi di pronuncia inventati.
- Progressi reali, tempo per attività completate, serie di giorni, salvataggio locale ed esportazione/importazione JSON validata con anteprima prima della sostituzione.
- Interfaccia responsive, manifest installabile e service worker per riuso offline dopo una prima apertura online. Funzioni esterne e alcune voci TTS restano dipendenti dalla rete e dal dispositivo.

## Tutor IA

Nessuna chiave è inclusa nel progetto. Il tutor libero rimane disabilitato finché il gestore non configura `ANTHROPIC_API_KEY` nell'ambiente server. `TUTOR_MODEL` è modificabile; default `claude-sonnet-5-5`, verificato nella ricerca alla data del progetto. In locale utilizzare un `.env.local` ignorato dal repository. Su Sites utilizzare le variabili d'ambiente protette del sito. Non inserire chiavi nel frontend, nel backup o nelle chat.

L'endpoint `/api/tutor` richiede autenticazione ChatGPT sul sito, valida origine e payload, limita la lunghezza dei messaggi e restituisce errori leggibili. La risposta IA viene validata con Zod. Il limite in memoria di dieci richieste/minuto per utente è per istanza Worker: prima di aprire il tutor a un pubblico ampio aggiungere una quota durevole a livello di gateway/account e limiti di spesa del fornitore. Nessuna richiesta a pagamento viene effettuata senza configurazione.

## Dati, licenze e sviluppo successivo

I progressi sono locali, separati per browser/dispositivo: account e sincronizzazione cloud non sono attivi. Le registrazioni audio non sono caricate. La dettatura può usare il servizio del browser e lo dichiara prima dell'avvio. La ricerca del dizionario invia solo la parola selezionata. Il tutor attivo invia le frasi al fornitore.

I livelli assegnati ai contenuti sono orientativi; questo materiale iniziale non costituisce un corso completo A1–C2. NGSL derivata resta separata in `lib/ngsl.json`, CC BY-SA 4.0 con attribuzione in `public/attribution.md`. Nessun asset di terzi o modello grafico è stato copiato. Gli esempi didattici sono originali. Tatoeba non è stato importato per evitare licenze audio non verificate per singola registrazione.

Evoluzioni previste: ampliare le letture per livello, aggiungere revisione didattica umana, sincronizzazione autenticata, servizio di trascrizione uniforme e valutazione fonetica validata. Lo stack Vinext mantiene la struttura Next.js del progetto iniziale, adattando il deployment a Sites.

## Account e progressi (8 ottobre 2026)

Home e dashboard ridisegnate, calendario di pratica, obiettivo giornaliero e completamenti per competenza. Integrazione Supabase con link email, Google OAuth e salvataggio protetto per utente. Per attivarla segui [ACCOUNT-SETUP.md](ACCOUNT-SETUP.md): in assenza delle variabili il login è esplicitamente disabilitato. Sito pubblico: https://inglese-two.vercel.app/.
