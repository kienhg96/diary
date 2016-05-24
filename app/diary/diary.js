'use strict'

var mongo = require('mongodb').MongoClient;
var ObjectID = require('mongodb').ObjectID;
var path = require('path');

module.exports = function(app) {
	app.get('/', function(req, res){
		res.sendFile(path.join(__dirname, '../../html/home.html'));
	});
 
	var dbaddr = process.env.MONGO_URI;
	//var dbaddr = "mongodb://127.0.0.1:27017/diary";
	app.post('/post', function(req, res){
		if (req.body.action === 'getContent'){
			//res.json([{'title' : 'First', 'content' : 'No content'}, {'title' : 'Second', 'content' : "It's Me"}]);
			mongo.connect(dbaddr,function(err, db){
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
			mongo.connect(dbaddr,function(err, db){
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
			mongo.connect(dbaddr, function(err, db){
				if (err) throw err;
				var collection = db.collection('mypost');
				collection.remove({ '_id': ObjectID(req.body.id)}, function(err, result){
					if (err) throw err;
					collection = db.collection('cmtmsg');
					collection.remove({'postid': req.body.id}, function(err, result){
						res.end();
						db.close();
					});
				});
			});
		} 
		else if (req.body.action === 'sendCmt'){
			mongo.connect(dbaddr, function(err, db){
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
			mongo.connect(dbaddr, function(err, db){
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
}