
# Modifica nella richiesta del progetto

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
detaglie della pagina, per esempio, nella pagina di piani, havere i piani e la
descrizione in il file `.html` e solo aggiornare i detaglie come i numeri de
personi e i prezzi.

## utilizzazione

Per usare il progetto, e semplicemente fare il deploy dell database (`make db`)
e dopo esseguire con `node` il server (`node server.js`)

```sh
make db
node server.js
```

