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
var user_id = 0;

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

/* GET home page, respond by rendering index.ejs */
app.get('/', function(req, res) {
  res.render('index', { title: 'search for cars' });
});

app.get('/useraccount', function(req, res) {
  res.render('myaccount', { title: 'search for cars' });
});


app.post('/', function(req, res) {
    user_id = req.body.email;
    res.render('search', {user_id: user_id})
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
    res.render('search_result', { title: 'akgjasgcdas' , searchresult:sql_result, user_id: user_id});
  });
});


app.listen(80, function () {
    console.log('Node app is running on port 80');
});

