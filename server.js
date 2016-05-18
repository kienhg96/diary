var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var app = express();

app.use(bodyparser.urlencoded({extended: true}));
app.use('/public', express.static(path.join(__dirname, 'public')));

app.get('/', function(req, res){
	res.sendFile(path.join(__dirname, 'html/home.html'));
});

app.post('/post', function(req, res){
	if (req.body.action === 'getContent'){
		//res.json([{'title' : 'First', 'content' : 'No content'}, {'title' : 'Second', 'content' : "It's Me"}]);
		mongo.connect('mongodb://127.0.0.1:27017/diary',function(err, db){
			if (err) throw err;
			var collection = db.collection('mypost');
			collection.find().toArray(function(err, data){
				var arr = [];
				data.forEach(function(doc){
					var j = {
						'title' : doc.title,
						'content' : doc.content
					};
					arr.push(j);
				});
				res.json(arr);
				db.close();
			});
		});
	}
	else if (req.body.action === 'post'){
		var j = {
			'title' : req.body.title,
			'content' : req.body.content
		};
		mongo.connect('mongodb://127.0.0.1:27017/diary',function(err, db){
			if (err) throw err;
			var collection = db.collection('mypost');
			collection.insert(
			{
			'title' : req.body.title,
			'content' : req.body.content
			}, function(err, data){
				if (err) throw err;
				db.close();
			});
		});
		res.send('Ok');
		console.log(req.body);
	}
	else {
		res.end();	
	}
});

app.listen(process.argv[2], function(){
	console.log('Server is listening on port ' + process.argv[2]);
});