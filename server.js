'use strict'

var express = require('express');
var path = require('path');
var bodyparser = require('body-parser');
require('dotenv').load();
var app = express();
var diary = require(path.join(__dirname, 'app/diary/diary.js'));
app.use(bodyparser.urlencoded({extended: true}));

app.use('/public', express.static(path.join(__dirname, process.env.PUBLIC_FOLDER)));
diary(app);


var port = process.env.PORT || 8080;
app.listen(port,  function () {
	console.log(process.env.MONGO_URI);
	console.log('Node.js listening on port ' + port + '...');
});