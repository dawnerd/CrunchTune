/*
	CrunchTune
	omnomnom - tasty tunes
	
	File: server.js
	Author: Troy Whiteley
	License: CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
*/

var express = require('express'),
	ct = require('./app/ct.js');

var app = express.createServer();

app.get('/', function(req, res){
  res.send('Hello World');
});

app.listen(ct.config.port);

console.log('Server started on port '+ct.config.port);