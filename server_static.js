var fs = require('fs');
var http = require('http');
var url = require('url');
var readline = require('readline');
var ROOT_DIR = "html";
http.createServer(function (req, res) {
  var urlObj = url.parse(req.url, true, false);

  if (urlObj.pathname.indexOf("comment") != -1) {
//	console.log('comment route');
	if (req.method === 'POST') {
		console.log('POST comment route');
		// First read the form data
		var jsonData = "";
		req.on('data', function (chunk) {
		  jsonData += chunk;
		});
		req.on('end', function () {
		   var reqObj = JSON.parse(jsonData);
//	 	   console.log(reqObj);
//		   console.log("Name: "+reqObj.Name);
//		   console.log("Comment: "+reqObj.Comment);
        	   // Now put it into the database
                   var MongoClient = require('mongodb').MongoClient;
                   MongoClient.connect("mongodb://localhost/weather", function(err, db) {
                   if(err) throw err;
                   db.collection('comments').insert(reqObj,function(err, records) {
                   console.log("Record added as "+records[0]._id);
                   });
                   });
		});
		res.writeHead(200);
		res.end();
	} else if (req.method === 'GET') {
	// Read all of the database entries and return them in a JSON array
		// Read all o fthe database entries and retrun them in a JSON array
		var MongoClient = require('mongodb').MongoClient;
		MongoClient.connect("mongodb://localhost/weather", function(err, db) {
		if (err) { throw err; }
		db.collection("comments", function(err, comments) {

		if (err) { throw err; }
		comments.find(function(err, items) {
			items.toArray(function(err, itemArr) {
			//	console.log("Document Array: ");
			//	console.log(JSON.stringify(itemArr));
				res.writeHead(200);
				res.end(JSON.stringify(itemArr));
			});
		});
		});
		});
	}

 //if (urlObj.pathname.indexOf('getcity') > -1) { // New Route
    // Then we have the getcity in here.
//    console.log('In getcity');
//	var myRe = new RegExp("^" + urlObj.query["q"]);
    // Now we need to read all of the names of cities.dat.txt
//    fs.readFile('cities.dat.txt', function(err, data) {
	// Now we read the data, put it in an array.
//	if (err) throw err;
//	cities = data.toString().split("\n");
	//console.log(cities);
//	json_results = []
//	for (var i = 0; i < cities.length; i++) {
		//console.log("cities[i]: " + cities[i]);
//		result = cities[i].search(myRe);
		//console.log("result: " + result);
//		if (result != -1) {
		//	console.log(cities[i]);
//			json_results.push({
//				city: cities[i]
//			});
//		}
//	}
//	console.log("Response: " + res);
//	console.log("Search results:");
//	console.log(JSON.stringify(json_results));
//	res.writeHead(200);
//	res.end(JSON.stringify(json_results));
  //  });


// Then read the cities.dat.txt file.
// Search int he file with the query prefix.
// Then return those names!
  } else {

  fs.readFile(ROOT_DIR + urlObj.pathname, function (err,data) {
    if (err) {
      res.writeHead(404);
      res.end(JSON.stringify(err));
      return;
    }
    res.writeHead(200);
    res.end(data);
  });

}
}).listen(80);



