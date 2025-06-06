# Modifiche nella richiesta del progetto

Per comodità, ho utilizzato un'immagine trovata su Internet e ho implementato il
login tramite JSON Web Tokens (JWT). Inizialmente, avevo pensato di usare un
cookie con il valore `loggedIn: <bool>`, ma ho poi deciso che fosse più pratico
inviare il codice fiscale dell'utente in ogni richiesta. La scelta di
implementare questa soluzione tramite JWT è motivata dalla necessità di
garantire una maggiore sicurezza.  Ho inoltre deciso di eliminare la pagina
`about-us`.

Penso anche che realizzare tutte le pagine (tranne la home o landing page)
tramite richieste AJAX sia una cattiva idea per motivi legati alla SEO. Una
scelta migliore potrebbe essere quella di non caricare l'intera pagina tramite
AJAX, ma solo i contenuti dinamici. Per esempio, nella pagina dei piani, i
titoli e le descrizioni potrebbero essere già presenti nel file `.html`, mentre
i dettagli come numero di persone e prezzi potrebbero essere caricati
dinamicamente.

## Riepilogo

-   **JWT login**, invia in ciascuna richiesta il codice fiscale dal membro, di
    in modo sicuro.

-   **Pagina "About us"** rimossa.

-   **AJAX** per i contenuti dinamici (tropo utilizzato, considerare il problema
    del SEO).

-   **configurazione** tramite `.env`.

# Utilizzo

Prima di tutto, è necessario che il server *PostgreSQL* sia in esecuzione.  Per
comodità durante il deploy, **non** utilizzo password per l’utente `postgres`
(vedi `makefile`, variabile `CLEAN_PSQL_FLAGS`).

Successivamente, è necessario generare un file `.env`.  Io ho utilizzato il
seguente:

```bash
DB_PASS=
DB_NAME=palestra_pwm
DB_HOST=localhost
DB_USER=postgres
JWT_SECRET='NWNK pbagrkghny_gbxrafyvqrf 15 sbyqre_mvcrfrepvmv 51
    Ernyvmmnmvbar r Pbafrtan Cebtrggb pbagrkghny_gbxrafyvqrf 81'
```

\newpage

Per usare il progetto, e semplicemente creare la database (`make clean_db`) e
fare il deploy dell database (`make db`) e dopo esseguire con `node` il server
(`node server.js`).

```sh
npm install # installa dipendenza sul file `./package.json`
make clean_db db # crea il db, tutte le tavole e aggiunge i valori
node server.js # ascoltando nel port 8000
```

Qui ci sono cualqun esempio di codice fiscale di utenti.  Le password sono
ugualle al codice fiscale dal utenti, aggiungendo "_123" alle fine.

- RSSMRC80A01F205X
- BNCGLA85B42F205Y
- FRRLSS90C03F205Z
- RMNSFA88D44F205A
