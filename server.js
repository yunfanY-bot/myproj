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

// should use cookie
var user_id = 0;

// set up ejs view engine 
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
 
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(express.static(__dirname + '../public'));

app.get('/', function(req, res) {
    res.redirect('/login');
});

app.get('/login', function(req, res) {
    res.render('login', { title: 'login' });
});

app.get('/search', function(req, res) {
    res.render('search', {user_id: user_id})
});

app.get('/update_contact', function(req, res) {
    res.render('update_contact', {user_id: user_id})
});

app.get('/useraccount', function(req, res) {
    var query_like = `SELECT * FROM likes WHERE likes.user_id = ${user_id}`;
    var like_result;
    console.log(query_like);
    connection.query(query_like, function(err, sql_like_result) {
        if (err) {
            res.send(err)
            return;
        }
        res.render('myaccount', { title: 'search for cars', like_result: sql_like_result, user_id: user_id});
        like_result = sql_like_result;
    });

});

app.get('/unlike_car', (req, res) => {
    var car_id = req.query.car_id;
    var delete_like_query = `DELETE FROM likes WHERE likes.user_id = ${user_id} AND likes.car_id = ${car_id};`;

    console.log(delete_like_query);
    connection.query(delete_like_query, function(err, sql_result) {
        if (err) {
            res.send(err)
            return;
        }
    });
    res.redirect('/useraccount');

})

app.get('/like_car', (req, res) => {
    var car_id = req.query.car_id;
    var add_like_query = `INSERT INTO likes(user_id, car_id) VALUES (${user_id}, ${car_id});`;

    console.log(add_like_query);
    connection.query(add_like_query, function(err, sql_result) {
        if (err) {
            res.send(err)
            return;
        }
        res.redirect('/useraccount');
    });
})

app.post('/login', function(req, res) {
    user_id = req.body.email;
    res.redirect('/search')
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

app.post('/new_contact', function(req, res) {
    var new_contact = req.body.new_contact;

    var update_contact_query = `UPDATE user SET contact_info = '${new_contact}' WHERE user_id = ${user_id}`;

    console.log(update_contact_query);
    connection.query(update_contact_query, function(err, sql_result) {
        if (err) {
            res.send(err)
            return;
        }
        res.redirect('/useraccount');
    });
});

app.listen(80, function () {
    console.log('Node app is running on port 80');
});

