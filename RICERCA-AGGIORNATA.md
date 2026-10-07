# Ricerca applicata al progetto English Site

Verifica delle fonti primarie: 7 ottobre 2026. Questo documento integra `RICERCA.md`: le raccomandazioni progettuali sono interpretazioni operative, non risultati di una sperimentazione su questa app.

## Decisioni didattiche

- **Richiamo prima della soluzione.** Nelle flashcard chiedere una risposta scritta o mentale, poi mostrare soluzione, esempio e autovalutazione. Pratica di recupero e studio distribuito hanno ricevuto valutazioni elevate nella revisione di Dunlosky et al.; ciò non dimostra che qualsiasi implementazione di flashcard sia efficace. [Pubblicazione APS](https://www.psychologicalscience.org/journals/pspi/1529100612453266/).
- **Ripasso distribuito reale.** Kim e Webb riportano benefici della pratica distribuita nell'apprendimento di una seconda lingua; la distanza ideale dipende anche dal materiale e dal tempo di mantenimento. Usare FSRS per le scadenze, senza presentare un intervallo fisso come scientificamente ottimale. [Meta-analisi, editore Wiley](https://onlinelibrary.wiley.com/doi/10.1111/lang.12479).
- **Bilanciare comprensione e produzione.** Il quadro di Nation distingue input, output, studio della lingua e sviluppo della fluidità. Integrare lettura/ascolto, una micro-regola, parole da richiamare e un dialogo concreto; ripetere materiale già noto per allenare la fluidità. Il bilanciamento è una guida al curriculum, non un obbligo di dividere ogni sessione in quattro quarti esatti. [Articolo dell'autore nell'archivio universitario](https://openaccess.wgtn.ac.nz/articles/journal_contribution/The_four_strands/12552167).
- **Obiettivi comunicativi.** Collegare i percorsi a compiti come presentarsi, ordinare, chiedere indicazioni e raccontare esperienze. I livelli CEFR descrivono capacità comunicative in più aree; non si ricavano con certezza contando le parole conosciute. Un breve quiz deve essere chiamato *orientamento iniziale*, con possibilità di cambiare percorso, senza certificazione o promessa di livello. [Descrittori ufficiali, Consiglio d'Europa](https://www.coe.int/en/web/common-european-framework-reference-languages/cefr-descriptors).

## Vocabolario: importazione verificabile

La lista **NGSL 1.2 contiene 2.809 parole**, non esattamente 2.800. Il progetto ufficiale dichiara copertura media del 92% circa nei testi di inglese generale: non è la percentuale compresa da un singolo studente e non garantisce comprensione di un testo specialistico. Il dominio ufficiale attuale è `.com`; le FAQ dichiarano che il precedente `.org` non appartiene più al progetto. [Pagina NGSL e licenza](https://www.newgeneralservicelist.com/new-general-service-list), [FAQ ufficiali](https://www.newgeneralservicelist.com/faqs-4).

File ufficiali utili:

- [NGSL 1.2 con statistiche e ranghi](https://www.newgeneralservicelist.com/s/NGSL_12_stats.csv). Download HTTP verificato; intestazione: `Lemma,SFI Rank,SFI,Adjusted Frequency per Million (U)`. Ordinare per `SFI Rank` numerico e selezionare le prime 1.000 righe per il primo mazzo.
- [Lemmi per l'insegnamento](https://www.newgeneralservicelist.com/s/NGSL_12_lemmatized_for_teaching.csv), collegato dalla stessa pagina ufficiale.

Conservare il file originale, la provenienza, la versione e la data di importazione. La pagina identifica **CC BY-SA 4.0** e gli autori Browne, Culligan e Phillips. Attribuire nel sito e nel file dati; mantenere i dati derivati separati dal codice. La lista non fornisce automaticamente un curriculum, traduzioni italiane corrette o esempi contestuali: aggiungerli con revisione, evitando di indicare che tutte le 1.000 parole hanno una lezione completa se ne sono state curate solo alcune.

**Tatoeba:** non considerare tutti gli audio coperti dalla stessa licenza dei testi. Le condizioni ufficiali consentono licenze diverse per contributore e impongono attenzione a restrizioni come NC o ND. Importare solo elementi con autore, ID e licenza registrati; nella prima versione usare esempi originali e sintesi vocale. [Condizioni ufficiali Tatoeba](https://tatoeba.org/en/terms_of_use).

## FSRS: API e salvataggio

La documentazione attuale di `ts-fsrs` richiede Node 20 o superiore. La versione effettiva deve essere quella installata e bloccata nel lockfile: il numero riportato nella ricerca originale non va trattato come versione eterna. API verificata:

```ts
import { createEmptyCard, fsrs, Rating } from 'ts-fsrs'
const scheduler = fsrs({ request_retention: 0.9 })
const card = createEmptyCard()
const result = scheduler.next(card, new Date(), Rating.Good)
// Persisti result.card e result.log, poi usa la nuova card al prossimo ripasso.
```

`repeat(card, now)` mostra i quattro esiti possibili; `next` applica il voto selezionato. La retention richiesta è un obiettivo del modello, non una percentuale garantita. Serializzare date, ricostruirle al caricamento, validare i dati importati e conservare storico dei ripassi. Non aumentare il contatore delle parole apprese solo perché una carta è stata aperta. [README ufficiale](https://github.com/open-spaced-repetition/ts-fsrs/blob/main/packages/fsrs/README.md).

## Voce e pronuncia

`SpeechSynthesis` e `SpeechRecognition` svolgono funzioni diverse. Rilevare nel browser sintesi, voci inglesi e riconoscimento; gestire caricamento delle voci, assenza di API, permesso negato, silenzio ed errori. Il riconoscimento resta a disponibilità limitata e su alcuni browser invia audio a un servizio remoto: non promettere che funzioni offline o che tutti i dati rimangano nel dispositivo. [Web Speech API](https://developer.mozilla.org/en-US/docs/Web/API/Web_Speech_API), [SpeechRecognition](https://developer.mozilla.org/en-US/docs/Web/API/SpeechRecognition).

Per registrare e riascoltare usare `getUserMedia` e `MediaRecorder`, con stop delle tracce quando termina l'attività. Il microfono richiede consenso e contesto sicuro; usare HTTPS in distribuzione. [Documentazione getUserMedia](https://developer.mozilla.org/en-US/docs/Web/API/MediaDevices/getUserMedia).

**Una trascrizione non valuta fonemi, accento o prosodia.** Il confronto fra testo atteso e testo riconosciuto può indicare corrispondenza delle parole, esplicitamente etichettata così. Per un'eventuale valutazione acustica futura esistono API dedicate con metriche separate per accuratezza, fluidità, completezza e prosodia, limiti di lingua e costi. Non fingere questa funzione nella modalità locale. [Pronunciation Assessment ufficiale Microsoft](https://learn.microsoft.com/en-us/azure/ai-services/speech-service/how-to-pronunciation-assessment).

## Tutor IA: confini e integrazione

Il modello `claude-sonnet-5-5` citato nel documento originale **è confermato dalla pagina ufficiale consultata**, quindi non va corretto come inesistente. La scelta deve comunque restare configurabile perché disponibilità, versioni e costi cambiano. [Catalogo ufficiale dei modelli](https://platform.claude.com/docs/en/models/overview).

Raccomandazione progettuale: esporre un endpoint interno `/api/tutor` che restituisca uno schema stabile (`reply`, `hint`, `corrections`), indipendente dal fornitore. Un adattatore server configura endpoint, modello e chiave tramite ambiente; un provider compatibile con Chat Completions richiede il relativo protocollo, mentre Anthropic Messages richiede un adattatore distinto. Non assumere compatibilità universale. L'API Anthropic usa Messages; vedere [riferimento ufficiale](https://platform.claude.com/docs/en/api/messages/create).

La chiave resta sul server. Validare input e output, limitare dimensione/storia/token, timeout e richieste; trattare le risposte come testo e non HTML. Il prompt deve chiedere un solo suggerimento di autocorrezione alla volta, spiegazioni italiane brevi e linguaggio adatto al percorso. Una correzione di IA resta una proposta: consentire di ignorarla prima di trasformarla in carta.

Senza credenziali usare **dialoghi guidati**, esplicitamente indicati come tali. Non presentare risposte predefinite come conversazione IA libera. Con credenziali, mostrare errori di connessione e stato della funzione; una chiave mancante non deve bloccare lettura, grammatica o ripasso.

## Criteri di completezza e limiti

Per la prima versione funzionante verificare: completamento di un quiz, risposta e correzione di un esercizio, ripasso con nuova scadenza, aggiunta di parole da lettura, dialogo guidato, audio ove disponibile, persistenza dopo ricarica, esportazione/importazione e layout mobile. Misurare minuti o attività effettive; partire da zero senza serie o statistiche inventate.

Il salvataggio locale non sincronizza dispositivi e può essere cancellato dal browser: prevedere backup esportabile. Account, sincronizzazione, importazione massiva degli esempi e valutazione acustica sono estensioni separate. Nessuna versione di questo sito garantisce fluidità o certifica il CEFR; il risultato dipende da pratica, qualità dei contenuti e uso reale della lingua.
