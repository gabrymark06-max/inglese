# Attivazione account e progressi online

Il codice è pronto ma login e cloud rimangono disabilitati finché Supabase non viene configurato. Il sito continua a salvare i progressi ospite sul dispositivo. Non servono chiavi service-role.

1. Crea un progetto in https://supabase.com/dashboard. Conserva la password database fuori dal repository.
2. Apri SQL Editor ed esegui `supabase/migrations/001_progress.sql` una volta. Crea la tabella protetta da RLS e una funzione di salvataggio con controllo atomico della revisione.
3. In Authentication → URL Configuration imposta Site URL `https://inglese-two.vercel.app` e aggiungi `https://inglese-two.vercel.app/` ai redirect consentiti. Per sviluppo aggiungi `http://localhost:3000/`. Evita wildcard di produzione.
4. Abilita Email. Il sito usa magic link: il primo accesso crea l’account, senza password. Configura un servizio SMTP per inviare email ai tuoi utenti; il servizio email predefinito Supabase è limitato e non è adatto alla produzione. Personalizza nome e template del messaggio.
5. Per Google, crea un client OAuth Web in Google Auth Platform. Scopes: openid, email, profile. Origin autorizzata `https://inglese-two.vercel.app`; redirect URI è il callback indicato dal provider Google in Supabase (`https://PROJECT.supabase.co/auth/v1/callback`). Inserisci client ID e secret nel provider Google di Supabase, mai nel codice. Configura pubblico/audience, branding e, se richiesto, verifica del consenso Google.
6. In Vercel → inglese → Settings → Environment Variables configura per Production `NEXT_PUBLIC_SUPABASE_URL` e `NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY` dai dati pubblici del progetto. Per locale copia `.env.example` in `.env.local`. Non usare secret key o service-role. Esegui un nuovo deployment perché le variabili NEXT_PUBLIC sono incluse nella build.
7. Prova con due account: email, Google, logout, ricaricamento e secondo dispositivo. Completa una lezione, controlla i progressi sincronizzati. Verifica che ciascun utente non possa leggere o modificare la riga dell’altro. Simula due dispositivi aperti: una revisione vecchia deve mostrare conflitto, senza sovrascrivere. Esporta eventuali modifiche locali prima di ricaricare il cloud.

## Dati e comportamento
L’account conserva il documento dei progressi: parole/FSRS, livello, obiettivo, attività con minuti e completamenti, errori ed incontri nei testi. Le copie locali sono separate per ID utente. Al logout riappare la copia ospite precedente. Il trasferimento della copia ospite è esplicito e richiede conferma. I minuti contano solo mentre la scheda dell’esercizio è visibile e ha focus; vengono registrati al completamento.

## Riferimenti ufficiali
- https://supabase.com/docs/guides/auth/auth-email-passwordless
- https://supabase.com/docs/guides/auth/social-login/auth-google
- https://supabase.com/docs/guides/auth/auth-smtp
- https://supabase.com/docs/guides/database/postgres/row-level-security

Prima di aprire registrazioni pubbliche completa anche informative privacy/termini coerenti con il trattamento reale e con il tuo titolare del servizio.

I link email usano PKCE: apri il link nello stesso browser da cui lo hai richiesto. Le copie locali non sincronizzate vengono recuperate alla riapertura; se la revisione cloud è cambiata il sito conserva la copia e segnala il conflitto. “Ricarica dal cloud” sostituisce la vista corrente: esporta prima eventuali modifiche.
