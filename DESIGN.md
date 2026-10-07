# Parla — English studio

## Direzione 2026-10-08
Una palestra di conversazione espressiva e adulta: blu notte, cobalto, azzurro ghiaccio e accenti corallo. Tipografia sans geometrica, titoli compatti e decisi, superfici bianche su fondo freddo. La scena principale usa una composizione originale di fumetti e onde sonore, realizzata in CSS/SVG. Le illustrazioni rappresentano il parlare; nessun dato dimostrativo viene presentato come progresso reale.

Riferimenti consultati e osservati renderizzati: Recent.design (gerarchia laterale, composizioni grafiche e contrasti), CollectUI (tipografia ampia, chiarezza delle azioni e ritmo degli spazi). Si adattano i principi al prodotto senza copiare le interfacce.

## Sistema
Colori: navy #182342, cobalto #3455eb, fondo #f3f5fb, testo #202943, azzurro #dce8ff, corallo #ffb5a0. Font: sans di sistema per una resa immediata senza richieste a servizi esterni. Titoli 700–800, tracking negativo moderato; testo almeno 14px dove possibile. Raggi 16–28px, bordi sottili e ombre leggere. Sidebar scura e navigazione mobile con cinque destinazioni. Login visibile nella barra superiore, stato di sincronizzazione esplicito.

## Funzioni e verifica
Preservare lezioni, FSRS, audio, import/export e progressi esistenti. Account email/Google tramite Supabase; dati protetti da RLS, nessuna service-role nel client. Salvataggi locali separati per account, conflitti segnalati invece di sovrascrivere altri dispositivi. Dashboard con obiettivo giornaliero, calendario reale e copertura dei contenuti. Controllare desktop e mobile reali, overflow, focus, contrasto e reduced motion. Login e cloud richiedono configurazione del provider: non simulare un accesso riuscito.
