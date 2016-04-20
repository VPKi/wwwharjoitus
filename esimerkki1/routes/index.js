var express = require('express');
var router = express.Router();

//Subdomainien  määrittely, kertoo ohjelmalle mitä kussakin subdomainissa renderoidään
/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Pelipankki R5' });
});

/* GET Hello World page. */
router.get('/helloworld', function(req, res) {
    res.render('helloworld', { title: 'Hello, World!' });
});

/* GET Userlist page. */
router.get('/userlist', function(req, res) {
    var db = req.db;
    var collection = db.get('usercollection');
    collection.find({},{},function(e,docs){
        res.render('userlist', {
            "userlist" : docs
        });
    });
});

/* GET New User page. This adds users and asks their info.*/
router.get('/newuser', function(req, res) {
    res.render('newuser', { title: 'Lisää Uusi Peli' });
});

/* POST to Add User Service. THis is not a subdomain! This is a process.*/
router.post('/adduser', function(req, res) {

    // Set our internal DB variable
    var db = req.db;

    // Get our form values. These rely on the "name" attributes
    var nimi = req.body.nimi;
    var alusta = req.body.alusta;
	var vuosi = req.body.vuosi;
	var kehittaja = req.body.kehittaja;
	var julkaisija = req.body.julkaisija;
	var genre = req.body.genre;

    // Set our collection
    var collection = db.get('usercollection');

    // Submit to the DB
    collection.insert({
        "nimi" : nimi,
	"vuosi" : vuosi,
	"alusta" : alusta,
        "kehittäjä" : kehittaja,
	"julkaisija" : julkaisija,
	"genre" : genre
    }, function (err, doc) {
        if (err) {
            // If it failed, return error
            res.send("There was a problem adding the information to the database.");
        }
        else {
            // And forward to success page
            res.redirect("userlist");
        }
    });
});

module.exports = router;
