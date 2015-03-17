var express = require('express');
var https = require('https');
var http = require('http');
var fs = require('fs');
var url = require('url');
var bodyParser = require('body-parser');
var basicAuth = require('basic-auth-connect');

var app = express();
var options = {
	host: '127.0.0.1',
	key: fs.readFileSync('ssl/server.key'),
	cert: fs.readFileSync('ssl/server.crt')
};

var auth = basicAuth( function(user, pass) {
	return ((user === 'cs360') && (pass === 'test'));
});

http.createServer(app).listen(80);
https.createServer(options, app).listen(443); // Builds a secure connection on default for secure connections. 443.
// app.use sets up routes.
app.use('/', express.static('./html', { maxAge: 60 * 60 * 1000 }));
// maxAge is set to 1000 hours...? Basically we can set the time that a proxy can cache it for 1000 hours before it has to get a new one. Proxy servers have these websites.
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.get('/getcity', function(req, res) {
	var urlObj = url.parse(req.url, true, false);
	//console.log("In getcity route");
	// Now we read the cities 
	var myRe = new RegExp("^" + urlObj.query["q"]);
	//console.log(myRe);
	var jsonresult = [];

	fs.readFile('cities.dat.txt', function (err, data) {
	  if(err) throw err;
	  cities = data.toString().split("\n");
	  for(var i = 0; i < cities.length; i++) {
	    	var result = cities[i].search(myRe);
		if (result != -1) {
			//console.log(cities[i]);
			jsonresult.push({ city: cities[i]  });
		}
	  }
	//res.writeHead(200);
	res.json(jsonresult);
	
	});
});


app.get('/comment', function(req, res) {
	console.log("In comment route.");
	// Read all of the database entries and return them in a JSON array
	var MongoClient = require('mongodb').MongoClient;
	MongoClient.connect("mongodb://localhost/weather", function(err, db) {
		if (err) { throw err; }
		db.collection("comments", function(err, comments) {

		if (err) { throw err; }
		comments.find(function(err, items) {
			items.toArray(function(err, resarray) {
			//	console.log("Document Array: ");
			//	console.log(JSON.stringify(itemArr));
			//	res.writeHead(200);
			//	res.end(JSON.stringify(itemArr));
				res.json(resarray);
			});
		});
		});
	});
});

app.post('/comment', auth, function(req, res) {
	console.log("In POST comment route.");
//	console.log(req.body.Name);
//	console.log(req.body.Comment);
	//console.log(req.user);
	//console.log("Remote User");
	//console.log(req.remoteUser);

	var reqObj = req.body;
//	console.log("reqObj: " + reqObj);
	// Now put it into the database
        var MongoClient = require('mongodb').MongoClient;
        MongoClient.connect("mongodb://localhost/weather", function(err, db) {
        	if(err) throw err;
                db.collection('comments').insert(reqObj,function(err, records) {
                	console.log("Record added as "+records[0]._id);
                });
        });

	res.status(200);
	res.end();
});


