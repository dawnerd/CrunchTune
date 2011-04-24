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

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');


app.mounted(function(other){
	console.log('Mounted (Oh babby)!');
});

app.dynamicHelpers({
	base: function(){
		return '/' == app.route ? '' : app.route;
	}
});

// Middleware
app.configure(function(){
	app.use(express.logger('\x1b[33m:method\x1b[0m \x1b[32m:url\x1b[0m :response-time'));
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(app.router);
	app.use(express.static(__dirname + '/public'));
	app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

// Routes
require('./routes/site')(app);

if (!module.parent) {
	app.listen(ct.config.port);
	console.log('Server started on port '+ct.config.port);
}