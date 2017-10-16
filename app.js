var express = require('express');
var bodyParser = require('body-parser');
var path = require('path');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var url = 'mongodb://localhost:27017/customerapp';
var ObjectId = require('mongodb').ObjectID
/*
var logger = function(req, res, next){
    console.log('Logging...');
    next();
}

app.use(logger);
*/

// View Engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));


// Body Parser Middleware 
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: false
}));

//Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

//Defining route 
app.get('/', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var users = db.collection('users');
        users.find({}).toArray(function (err, docs) {
            res.render('index', {
                title: "Customers",
                users: docs
            });
            db.close();
        });
    });
    //res.send('Hello World');
    //res.json(people);
});

app.post('/users/add', function (req, res) {
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var users = db.collection('users');
        users.insert({
            first_name: req.body.first_name,
            last_name: req.body.last_name,
            email: req.body.email
        });
        res.redirect('/');
        db.close();
        });
});

app.delete('/users/delete/:id',function(req,res){
    MongoClient.connect(url, function (err, db) {
        assert.equal(null, err);
        var users = db.collection('users');
        var query = { _id : ObjectId(req.params.id) };
        users.remove(query,function(err, result){
            if(err){
                console.log(err);
            }
            res.redirect('/');
            db.close();
        });
    });
});

app.listen(3000, function () {
    console.log('listening to posrt 3000.......');
});