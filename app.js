const express = require('express');
const path = require('path');
var logger = require('morgan');

const sqlite3 = require('sqlite3').verbose();
var app = express();
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(express.static(path.join(__dirname, 'public')));

// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  var locals = {};
  res.render('home', locals);
});

app.get('/pokemon/list', (req, res) => {
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