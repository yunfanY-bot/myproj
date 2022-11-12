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
    var query_uncommented = `SELECT transaction_id, price, buy_date, transaction_id2
                                FROM used_car.transaction as T1 JOIN (SELECT *
                                                                    FROM used_car.buy
                                                                    WHERE transaction_id2 IN (SELECT transaction_id
                                                                                                FROM used_car.transaction
                                                                                                WHERE comment_status = 0
                                                                                                ) AND buyer_id = ${user_id}
                                                                    ) as sub ON T1.transaction_id = sub.transaction_id2;`;
/*    var query_rate1 =
        `SELECT avg(rating) as avg_rating
    FROM rate
    WHERE ratee_id = ${user_id}`;*/
    var query_rate1 =
        `SELECT sub.id, SUM(sub.sum_rating)/SUM(sub.num_rate) as avg_rating
        FROM (SELECT r1.rater_id as id, SUM(r1.rating) as sum_rating, COUNT(r1.rate_id) as num_rate
           FROM used_car.rate r1
           GROUP BY r1.rater_id
           UNION
           SELECT r2.ratee_id as id, SUM(r2.rating) as sum_rating, COUNT(r2.rate_id) as num_rate
           FROM used_car.rate r2
           GROUP BY r2.ratee_id) as sub
        WHERE id = ${user_id}
        GROUP BY sub.id
        ORDER BY sub.id`

    console.log(query_like);
    connection.query(query_like, function(err, sql_like_result) {
        if (err) {
            res.send(err)
            return;
        }
        console.log(query_like);
        connection.query(query_uncommented, function(err, sql_uncommented_result) {
            if (err) {
                res.send(err)
                return;
            }
            console.log(query_like);
            connection.query(query_rate1, function(err, sql_rate1_result) {
                if (err) {
                    res.send(err)
                    return;
                }
                res.render('myaccount', { title: 'search for cars',
                    like_result: sql_like_result,
                    avg_rate_result: sql_rate1_result,
                    uncommented_result: sql_uncommented_result,
                    user_id: user_id});
            });
        });
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

app.get('/useraccount/unlike_car', (req, res) => {
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

