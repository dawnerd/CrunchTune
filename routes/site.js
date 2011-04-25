/*
	CrunchTune
	omnomnom - tasty tunes
	
	File: site.js
	Author: Troy Whiteley
	License: CC BY-SA 3.0 (http://creativecommons.org/licenses/by-sa/3.0/)
*/

var ct = require('../app/ct'),
	url = require('url');

module.exports = function(app, oa){
	app.get('/', function(req, res){
		oa.post(
			ct.config.rdio_api, 
			req.session.oauth_access_token, 
			req.session.oauth_access_token_secret, 
			{
				method: 'getTopCharts',
				type: 'Track',
				count: 5
			},
			null,
			function(error, data, response){
				var songs = JSON.parse(data);
				oa.post(
					ct.config.rdio_api, 
					req.session.oauth_access_token, 
					req.session.oauth_access_token_secret, 
					{
						method: 'getPlaybackToken',
						domain: encodeURIComponent('http://'+ct.config.host+':'+ct.config.port)
					},
					null,
					function(error, data, response){
						if(error !== null) console.log(error);
						console.log(JSON.parse(data));
						res.render('index', {
							playbackToken: JSON.parse(data).result,
							songs: songs.result
						});
					}
				);
			}
		);
	});
	
	app.get ('/oauth/login', function(req, res, params) {
		if(!req.session.oauth_access_token) {
			oa.getOAuthRequestToken(function(error, oauth_token, oauth_token_secret, results){
				if(error) {
					console.log('error');
					console.log(error);
				} else { 
					// store the tokens in the session
					req.session.oauth_token = oauth_token;
					req.session.oauth_token_secret = oauth_token_secret;

					// redirect the user to authorize the token
					res.redirect(ct.config.rdio_oauth_auth+oauth_token);
				}
			});
		} else {
			res.redirect("/");
		}
	});

	app.get ('/oauth/callback', function(req, res, params) {
		var parsedUrl = url.parse(req.url, true);
		oa.getOAuthAccessToken(parsedUrl.query.oauth_token, req.session.oauth_token_secret, parsedUrl.query.oauth_verifier, 
			function(error, oauth_access_token, oauth_access_token_secret, results) {
				req.session.oauth_access_token = oauth_access_token;
				req.session.oauth_access_token_secret = oauth_access_token_secret;
				res.redirect("/");
			}
		)
	});
};