const express = require('express');
const sqlite3 = require('sqlite3').verbose();
var app = express();

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  res.send('hello world');
});

app.get('/pokemons/list', (req, res) => {
  let db = new sqlite3.Database('./pokemons.db');
  let sql = 'SELECT * FROM pokemons LIMIT 20';
  db.all(sql, [], (err, rows) => {
    if (err) {
      throw err;
    }
    db.close();
    res.send(rows)
  });
});

app.listen(8000, () => {
  console.log('Listening to Port 8000');
});