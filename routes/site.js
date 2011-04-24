/*
	CrunchTune
	omnomnom - tasty tunes
	
	File: site.js
	Author: Troy Whiteley
	License: CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
*/

module.exports = function(app){
	app.get('/', function(req, res){
		res.render('index', {
			
		});
	});
};
