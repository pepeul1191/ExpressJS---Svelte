const express = require('express');
const path = require('path');
const fileUpload = require('express-fileupload');
var bodyParser = require('body-parser');
var logger = require('morgan');
var cors = require('cors')
const fs = require('fs');

const sqlite3 = require('sqlite3').verbose();
var app = express();
app.use(cors({
  origin: '*',
}))
app.use(fileUpload({createParentPath: true, tempFileDir: '/tmp/'}));
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
  sql += ' LIMIT 20'
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
  let connection = dbApp()
  let sql = `SELECT * FROM pokemons WHERE number=?`;
  connection.get(sql, [pokemonNumber], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    console.log(row)
    res.send(row)
  });
});

app.post('/pokemon/save', async (req, res, next) => {
  // data
  let status = 200
  let resp = ''
  var id = req.body.id;
  var number = req.body.id;
  var name = req.body.name;
  var weight = parseFloat(req.body.weight);
  var height = parseFloat(req.body.height);
  var img = req.body.image_url;
  // logic
  var sql = '';
  var params = [];
  if(id == 0){
    sql = `INSERT INTO pokemons (number, name, weight, height, image_url) VALUES (?,?,?,?,?)`;
    params = [number, name, weight, height, img]
  }else{
    sql = `UPDATE pokemons SET number = ?,name = ?, weight = ?, height = ?, image_url=? WHERE id=?`;
    params = [number, name, weight, height, img, id]
  }
  let connection = dbApp()
  connection.get(sql, params, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }else{
      connection.close();
      if (id != 0){
        resp = "20000"
      }else{
        resp = id
      }
      res.status(200).send(resp)
    }
  });
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
        // console.error(err)
        if (err) {
          // console.error(err.message)
          connection.close();
          res.status(500).send('Error al crear al nuevo usuario')
        }
        res.status(200).send(this.lastID.toString())
      });
    }else{
      connection.close();
      res.status(500).send('Usuario y/o correo ya existentes')
    }
  });
});

app.post('/user/reset_password', async (req, res, next) => {
  // data
  var email = req.body.email;
  // logic
  var query = `SELECT COUNT(*) AS count FROM users WHERE email=?`;
  let connection = dbApp()
  connection.get(query, [email], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    console.log(row)
    if (row['count'] == 1){
      res.status(200).send('Todo OK')
    }else{
      connection.close();
      res.status(500).send('Correo no registrado')
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
      res.status(200).send(response)
      //res.status(200).send(row['id'].toString())
    }else{
      res.status(500).send('Usuario y/o contraseña incorrectos')
    }
  });
});

app.get('/user/fetch_one', (req, res) => {
  // data
  let userId = req.query.id;
  // logic
  let connection = dbApp()
  let sql = `SELECT id, name, user, email, image_url FROM users WHERE id=?`;
  connection.get(sql, [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    res.send(row)
  });
});

app.get('/user/pokemon', (req, res) => {
  // data
  let userId = req.query.id;
  // logic
  let connection = dbApp()
  let sql = `
    SELECT P.id, P.name, P.number, P.weight, P.height, P.image_url FROM pokemons P INNER JOIN users_pokemons UP ON UP.pokemon_id = P.id  WHERE UP.user_id = ?;`;
  connection.all(sql, [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    res.send(row)
  });
});


app.get('/user/following', (req, res) => {
  // data
  let userId = req.query.user_id;
  // logic
  let connection = dbApp()
  let sql = `
    SELECT U.id, U.name, U.user, U.email, U.image_url FROM users U INNER JOIN users_followers UF 
    ON U.id = UF.user_id WHERE UF.follower_id = ?;`;
  connection.all(sql, [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    res.send(row)
  });
});

app.get('/user/follower', (req, res) => {
  // data
  let userId = req.query.user_id;
  // logic
  let connection = dbApp()
  let sql = `
  SELECT id, name, user, email, image_url FROM users WHERE id IN (
    SELECT UF.follower_id  FROM users U LEFT OUTER JOIN users_followers UF 
      ON U.id = UF.user_id WHERE UF.user_id = ?
  )`;
  connection.all(sql, [userId], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }
    connection.close();
    res.send(row)
  });
});

app.post('/upload/demo', async (req, res, next) => {
  // data
  var extraData = req.body.extra_data;
  var file = req.files['file'];
  const uploadDir = 'public/uploads/';
  const absUploadDir = path.join(__dirname, uploadDir, file['name']);
  // logic
  file.mv(absUploadDir, (err) => {
    if (err) {
      console.log(err)
      return res.status(500).send("Error con el archivo enviado");
    }
    res.status(200).send('response')
  });
});

app.post('/user/update', async (req, res, next) => {
  // data
  var id = req.body.id;
  var user = req.body.user;
  var name = req.body.name;
  var email = req.body.email;
  // logic
  let sql = `UPDATE users SET user = ?, name = ?, email = ? WHERE id=?`;
  let params = [user, user, email, id];
  let connection = dbApp();
  connection.get(sql, params, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }else{
      connection.close();
      res.status(200).send('Ok')
    }
  });
});

app.post('/user/password', async (req, res, next) => {
  // data
  var id = req.body.id;
  var password = req.body.password;
  // logic
  let sql = `UPDATE users SET password = ? WHERE id=?`;
  let params = [password, id];
  let connection = dbApp();
  connection.get(sql, params, (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('ups, ocurrió un error');
    }else{
      connection.close();
      res.status(200).send('Ok')
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
      res.status(200).send(response)
      //res.status(200).send(row['id'].toString())
    }else{
      res.status(500).send('Usuario y/o contraseña incorrectos')
    }
  });
});

app.listen(8000, () => {
  console.log('Listening to Port 8000');
});