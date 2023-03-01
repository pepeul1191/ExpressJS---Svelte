const express = require('express');
const path = require('path');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors')
const Sequelize = require('sequelize');

const sqlite3 = require('sqlite3').verbose();
var app = express();
app.use(cors({
  origin: '*',
}))
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// database
const db = new Sequelize('database', 'username', 'password', {
	// host: 'localhost',
	dialect: 'sqlite',
	pool: {
		max: 5,
		min: 0,
		idle: 10000
	},
	storage: './pokemons.db',
	define: {
		timestamps: false // true by default
	}
});
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  var locals = {};
  res.render('home', locals);
});

app.get('/pokemon/list', (req, res) => {
  // data
  // logic
  const db = new sqlite3.Database('./pokemons.db');
  let sql = 'SELECT * FROM pokemons LIMIT 20';
  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      throw err;
    }
    db.close();
    res.send(rows)
  });
});

app.get('/pokemon', (req, res) => {
  // data
  let id = req.query.id;
  // logic
  const db = new sqlite3.Database('./pokemons.db');
  let sql = `SELECT * FROM pokemons WHERE id=?`;
  db.get(sql, [id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    db.close();
    res.send(row)
  });
});

app.get('/pokemon/:number', (req, res) => {
  // data
  let pokemonNumber = req.params.number;
  // logic
  const db = new sqlite3.Database('./pokemons.db');
  let sql = `SELECT * FROM pokemons WHERE number=?`;
  db.get(sql, [pokemonNumber], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    db.close();
    res.send(row)
  });
});

app.post('/pokemon/add', async (req, res, next) => {
  // data
  var number = req.body.number;
  var name = req.body.name;
  var type_1 = req.body.type_1;
  var type_2 = req.body.type_2;
  var weight = parseFloat(req.body.weight);
  var height = parseFloat(req.body.height);
  var img = req.body.img;
  // logic
  var query = `INSERT INTO pokemons (number, name, type_1, type_2, weight, height, img) VALUES (${number}, '${name}', '${type_1}', '${type_2}', ${weight}, ${height}, '${img}')`;
  try{
    const result = await db.query(query, { returning : true });
    res.send(result[1].lastID);
  }catch(error){
    console.log(error);
    return res.send('error').status(500);
  } 
});

app.listen(8000, () => {
  console.log('Listening to Port 8000');
});