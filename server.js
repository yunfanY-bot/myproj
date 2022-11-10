var express = require('express');
var bodyParser = require('body-parser');
var mysql = require('mysql2');
var path = require('path');
var connection = mysql.createConnection({
                host: '34.121.153.191',
                user: 'root',
                password: 'yyfsss123',
                database: 'used_car'
});

connection.connect;


var app = express();

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('search', { title: 'search for cars' });
});

app.get('/success', function(req, res) {
  res.send({'message': 'User ID: 0 liked car_id: ' + '${car_id}'});
});
 
app.get('/display-like', function(req, res) {
  res.render('display-like', { title: 'Like your car' });
});

// this code is executed when a user clicks the form submit button
app.post('/like', function(req, res) {
  var car_id = req.body.car_id;
   
  var sql = `INSERT INTO likes (user_id, car_id) VALUES (0, '${car_id}')`;

console.log(sql);
  connection.query(sql, function(err, result) {
    if (err) {
      res.send(err)
      return;
    }
    res.redirect('/display-like');
  });
});

app.post('/display_result', function(req, res) {
  var search_maker = req.body.search_maker;
   
  var sql = `SELECT * FROM car WHERE car.manufactor LIKE '${search_maker}'`;

console.log(sql);
  connection.query(sql, function(err, sql_result) {
    if (err) {
      res.send(err)
      return;
    }
    res.render('search_result', { title: 'akgjasgcdas' , searchresult:sql_result});
  });
});



app.listen(80, function () {
    console.log('Node app is running on port 80');
});

