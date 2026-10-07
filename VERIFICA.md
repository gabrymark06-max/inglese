# Verifica Parla — 8 ottobre 2026

## Esito
Build di produzione riuscita, TypeScript senza errori e tre test automatici passati su scheduling FSRS, serializzazione/ripristino, validazione di backup malformati e serie di giorni.

## Prove nel browser reale
- Primo avvio: profilo, obiettivo e ingresso A1.
- Desktop 1440×1000 e telefono 390×844: home, schermate didattiche e navigazione. Nessun overflow orizzontale rilevato nelle schermate provate.
- Sessione: ripasso vuoto → cinque parole nuove; scrittura `hello`, feedback corretto e valutazione FSRS. Dopo il ricaricamento, la parola e la scadenza restano salvate.
- Lezione to be: quattro risposte corrette, risultato 4/4 e completamento nei progressi.
- Lettura A1: parola coffee selezionata e aggiunta al mazzo, risposta di comprensione corretta, completamento. Rifinito il pannello parola mobile per mostrarlo subito e permettere la chiusura.
- Dialogo al caffè: risposta senza espressioni attese → invito a riformulare → esempio; tre turni completati, frase suggerita nei progressi e nel mazzo.
- Test iniziale: dodici risposte corrette, risultato 12/12 e proposta B2.
- Schermate mobili ispezionate visivamente. Stati di controllo disabilitato e feedback visibili, focus dei campi leggibile; contenuti principali disponibili anche senza microfono.

## Limiti della verifica
Registrazione e dettatura non esercitate con un microfono fisico: permessi e disponibilità dipendono dal browser. Tutor IA non testato con richieste a pagamento: nessuna chiave è configurata; verificata la gestione dello stato non configurato. L'installazione PWA e l'uso offline vanno controllati anche sul dispositivo finale; manifest, icone e service worker sono inclusi.

## Dati di prova
Le prove hanno generato un profilo locale soltanto su 127.0.0.1. Nessun profilo o progresso di esempio viene distribuito agli utenti. Le statistiche del sito pubblicato partono da zero.
