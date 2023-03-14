# Express Svelte

Instalar dependencias:

    $ npm install

Ejecutar aplicación:

    $ npm run start

## Migraciones

Archivo <b>.env</b>

    DB=sqlite:db/app.db
    SQALCHEMY_CONNECTION_STRING=sqlite:///db/app.db
    ENV=localhost||replit

Migraciones con DBMATE - app:

    $ dbmate -d "db/migrations" -e "DB" new <<nombre_de_migracion>>
    $ dbmate -d "db/migrations" -e "DB" up
    $ dbmate -d "db/migrations" -e "DB" rollback

Backup SQLite

    $ sqlite3 app.db .dump > dbname.bak

---

+ https://progressivewebninja.com/how-to-create-and-run-your-first-svelte-rollup-application/
+ https://github.com/pepeul1191/express-boileerplate-3