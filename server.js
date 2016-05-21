var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
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
						'id' : doc._id,
						'title' : doc.title,
						'content' : doc.content,
						'date' : doc.date
					};
					arr.push(j);
				});
				res.json(arr);
				db.close();
			});
		});
	}
	else if (req.body.action === 'post'){
		mongo.connect('mongodb://127.0.0.1:27017/diary',function(err, db){
			if (err) throw err;
			//console.log(req.body.date);
			var collection = db.collection('mypost');
			collection.insert(
			{
			'title' : req.body.title,
			'content' : req.body.content,
			'date' : req.body.date
			}, function(err, data){
				if (err) throw err;
				res.send(data.insertedIds[0]);
				db.close();
			});
		});
	}
	else if (req.body.action === 'delete'){
		mongo.connect('mongodb://127.0.0.1:27017/diary', function(err, db){
			if (err) throw err;
			var collection = db.collection('mypost');
			collection.remove({ '_id': ObjectID(req.body.id)}, function(err, result){
				if (err) throw err;
				//console.log(result);
				res.end();
				db.close();
			});
		});
	} 
	else if (req.body.action === 'sendCmt'){
		mongo.connect('mongodb://127.0.0.1:27017/diary', function(err, db){
			if (err) throw err;
			var collection = db.collection('cmtmsg');
			collection.insert({
				'postid': req.body.id,
				'msg': req.body.msg,
				'date': req.body.date
			}, function(err, data){
				if (err) throw err;
				res.end();
				db.close();
			});
		});
	} 
	else if (req.body.action === 'getCmt'){
		mongo.connect('mongodb://127.0.0.1:27017/diary', function(err, db){
			if (err) throw err;
			var collection = db.collection('cmtmsg');
			collection.find({'postid' : req.body.id}).toArray(function(err, data){
				var arr = [];
				data.forEach(function(elem){
					arr.push({
						'msg': elem.msg,
						'date': elem.date
					});
				});
				res.json(arr);
				db.close();
			});
		});
	}
	else {
		res.end();
	}
});

app.listen(process.argv[2] || 8080 , function(){
	console.log('Server is listening on port ' + process.argv[2]);
});