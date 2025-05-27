- TODO:

    - [ ] jwt

    - [ ] secrets management (bbdd, jwt keys)

    - [ ] password login

    - [ ] courses page

    - [ ] about us page

    - [ ] js verification for forms (2)

    - [ ] como usar el proyecto (readme)

        - [ ] como usar el proyecto

        - [ ] usuario y contraseña de prueba

        - [ ] estructura

# Modifica nella richiesta del progetto

Per comodità, ho utilizzato un'immagine trovata su Internet e ho implementato il
login tramite JSON Web Tokens (JWT). Inizialmente, avevo pensato di usare un
cookie con la forma `loggedIn: <bool>`, ma ho poi deciso che fosse più pratico
inviare il codice fiscale dell'utente in ogni richiesta. La scelta di
implementare questa soluzione tramite JWT è motivata dalla necessità di
garantire una maggiore sicurezza.
