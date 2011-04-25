/*
	CrunchTune
	omnomnom - tasty tunes
	
	File: server.js
	Author: Troy Whiteley
	License: CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
*/

var express = require('express'),
	ct = require('./app/ct.js'),
	OAuth = require('oauth').OAuth,
	querystring = require('querystring');
	
var app = express.createServer();

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');

//oauth setup
app.use(express.logger());
app.use(express.bodyParser());
app.use(express.cookieParser());
app.use(express.session({
	secret: "98yKGKgkdrg94tnkfdh"
}));

app.dynamicHelpers({
	base: function(){
		return '/' == app.route ? '' : app.route;
	},
	session: function(req, res){
		return req.session;
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

//setup oauth
var oa = new OAuth(
	ct.config.rdio_oauth_request,
	ct.config.rdio_oauth_access, 
	ct.config.rdio_api_key,
	ct.config.rdio_api_shared, 
	"1.0", "http://"+ct.config.host+":"+ct.config.port+"/oauth/callback", "HMAC-SHA1");

// Routes
require('./routes/site')(app, oa);

if (!module.parent) {
	app.listen(ct.config.port);
	console.log('Server started on port '+ct.config.port);
}