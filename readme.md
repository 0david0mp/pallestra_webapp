# Modificazione nella richiesta del progetto

Per comodità, ho utilizzato un'immagine trovata su Internet e ho implementato il
login tramite JSON Web Tokens (JWT). Inizialmente, avevo pensato di usare un
cookie con la forma `loggedIn: <bool>`, ma ho poi deciso che fosse più pratico
inviare il codice fiscale dell'utente in ogni richiesta. La scelta di
implementare questa soluzione tramite JWT è motivata dalla necessità di
garantire una maggiore sicurezza.  Anche, ho deciso di eliminare la pagina
`about-us`.

Anche penso che il fare tutte le pagine (tranne la pagina di home o landing) via
AJAX richiesta è una idea mala per cose come il SEO.  Una scelta migliore
potrebbe essere fare non tutta la pagina tramite AJAX, e solo aggiungere i
dettagli della pagina, per esempio, nella pagina di piani, avere i piani e la
descrizione in il file `.html` e solo aggiornare i dettagli come i numeri de
persone e i prezzi.

## riepilogo

-   **JWT login**, invia in ciascuna richiesta il codice fiscale dal membro, di
    forma sicura.

-   **About us** pagine cancellata.

-   **AJAX** per i contenuti dinamici (tropo utilizzato, considerare il problema
    del SEO).

-   **configurazione** tramite `.env`.

# utilizzazione

Per usare il progetto, e semplicemente fare il deploy dell database (`make db`)
e dopo esseguire con `node` il server (`node server.js`).

```sh
npm install # installa dipendenza sul file `./package.json`
make db # crea il db, tutte le tavole e aggiunge i valori
node server.js
```

Qui ci sono cualqun esempio di codice fiscale di utenti.  Le password sono
ugualle al codice fiscale dal utenti, aggiungendo "_123" alle fine.
