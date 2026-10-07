# Distribuzione Vercel

Repository: https://github.com/gabrymark06-max/inglese

Il repository contiene l'applicazione nella radice. Importare la repository in Vercel usando il framework Next.js; `vercel.json` seleziona `next build --webpack` senza modificare la build Sites/Vinext originale.

Per una build locale equivalente:

```text
node node_modules/next/dist/bin/next build --webpack
node node_modules/next/dist/bin/next start
```

Per pubblicare gli aggiornamenti: commit e push sul branch main della repository collegata. In alternativa, dalla radice del progetto collegato, eseguire `vercel deploy --prod`.

Il ripasso, i contenuti, la voce del browser e i backup locali funzionano su entrambi gli hosting. I progressi sono separati per dominio: esportarli e importarli per trasferirli da Sites a Vercel.

Il tutor IA rimane disabilitato su Vercel: gli header di identità ChatGPT sono verificati dal gateway Sites e non costituiscono autenticazione su Vercel. Occorre integrare un'autenticazione compatibile prima di attivare il servizio a pagamento. Le conversazioni guidate sono già disponibili.
