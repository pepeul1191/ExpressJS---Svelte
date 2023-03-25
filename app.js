const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors')
const Sequelize = require('sequelize');

const sqlite3 = require('sqlite3').verbose();
var app = express();
app.use(cors({
  origin: '*',
}))
app.use(fileUpload({createParentPath: true}));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static(path.join(__dirname, 'public')));
// database
const db = () => {return new sqlite3.Database('./pokemons.db');}
const dbApp = () => {return new sqlite3.Database('./db/app.db');}
// respond with "hello world" when a GET request is made to the homepage
app.get('/', (req, res) => {
  var locals = {};
  res.render('home', locals);
});

app.get('/pokemon/list', (req, res) => {
  // data
  let pokemonName = (typeof req.query.name === 'undefined') ? "" : req.query.name ;
  let generationIds = (typeof req.query.generation_ids === 'undefined') ? "" : req.query.generation_ids;
  generationIds = generationIds.split( '||')
  generationIdQuqery = '('
  generationIds.forEach((id) => {
    generationIdQuqery += (id + ",")
  })
  generationIdQuqery += ")"
  if(generationIdQuqery.length > 1){

    generationIdQuqery = 
      generationIdQuqery.substring(0, generationIdQuqery.length - 2) + 
      generationIdQuqery.substring(generationIdQuqery.length - 1);
  }
  // logic
  let connection = dbApp()
  let sql = `SELECT P.id, P.name, P.number, P.weight, P.height, P.image_url, P.generation_id, G.name AS generation_name 
    FROM pokemons P INNER JOIN generations G ON P.generation_id = G.id`;
  sql = (pokemonName != "" || generationIdQuqery != "()") ? (sql += ' WHERE ') : sql  
  sql = (pokemonName != "") ? (sql += ` P.name LIKE "%${pokemonName}%"`) : sql
  sql = (pokemonName != "" && generationIdQuqery != "()") ? (sql += ' AND ') : sql
  sql = (generationIdQuqery != "()") ? (sql += ` P.generation_id IN ${generationIdQuqery}`) : sql
  connection.all(sql, [], (err, rows) => {
    if (err) {
      console.error(err);
      throw err;
    }
    connection.close();
    res.send(rows).status(200)
  });
});

app.get('/pokemon', (req, res) => {
  // data
  let id = req.query.id;
  // logic
  let connection = db()
  let sql = `SELECT * FROM pokemons WHERE id=?`;
  connection.get(sql, [id], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    res.send(row)
  });
});

app.get('/pokemon/:number', (req, res) => {
  // data
  let pokemonNumber = req.params.number;
  // logic
  let connection = db()
  let sql = `SELECT * FROM pokemons WHERE number=?`;
  connection.get(sql, [pokemonNumber], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    res.send(row)
  });
});

app.post('/pokemon/add', async (req, res, next) => {
  // data
  let status = 200
  let resp = ''
  var number = req.body.number;
  var name = req.body.name;
  var type_1 = req.body.type_1;
  var type_2 = req.body.type_2;
  var weight = parseFloat(req.body.weight);
  var height = parseFloat(req.body.height);
  var img = req.body.img;
  // logic
  var query = `INSERT INTO pokemons (number, name, type_1, type_2, weight, height, img) VALUES (${number}, '${name}', '${type_1}', '${type_2}', ${weight}, ${height}, '${img}')`;
  let connection = db()
  try{
    const result = await connection.query(query, { returning : true });
    resp = result[1].lastID;
  }catch(error){
    console.log(error);
    resp = 'Error'
  }finally{
    connection.close()
  }
  // response
  return res.send(resp).status(status);
});

app.post('/user/create', async (req, res, next) => {
  // data
  var user = req.body.user;
  var password = req.body.password;
  var email = req.body.email;
  var image_url = 'user_default.png';
  // logic
  var query1 = `SELECT COUNT(*) AS count FROM users WHERE user=? OR email=?`;
  var query2 = `INSERT INTO users (user, password, email, image_url) VALUES (?, ?, ?, ?)`;
  let connection = dbApp()
  connection.get(query1, [user, email], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    if (row['count'] == 0){
      connection.run(query2, [user, password, email, image_url], function(err) {
        if (err) {
          console.log(err.message)
          connection.close();
          res.status(500).send('Usuario y/o correo ya existentes')
        }
        res.status(200).send({message: this.lastID})
      });
    }else{
      connection.close();
      res.status(500).send('Usuario y/o correo ya existentes')
    }
  });
});

app.post('/user/validate', async (req, res, next) => {
  // data
  var user = req.body.user;
  var password = req.body.password;
  // logic
  let connection = dbApp()
  let sql = `SELECT id, COUNT(*) AS count, user, name, email, image_url FROM users WHERE user=? AND password=?`;
  connection.get(sql, [user, password], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    if (row['count'] == 1){
      var response = {
        id:row['id'],
        user: row['user'], 
        name: row['name'], 
        email: row['email'], 
        image_url: row['image_url']
      }
      console.log(response)
      res.status(200).send(response)
    }else{
      res.status(500).send('Usuario y/o contraseña incorrectos')
    }
  });
});

app.post('/user/update', async (req, res, next) => {
  // data
  var id = req.body.id;
  var name = req.body.name;
  var files = req.files;
  console.log(files)
  // logic
  res.status(200).send('response')
});

app.listen(8000, () => {
  console.log('Listening to Port 8000');
});