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
				count: 100
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
						domain: encodeURIComponent(ct.config.host)
					},
					null,
					function(error, data, response){
						if(error) throw new Error(error);
						var playbackToken = JSON.parse(data).result;
						oa.post(
							ct.config.rdio_api, 
							req.session.oauth_access_token, 
							req.session.oauth_access_token_secret, 
							{
								method: 'currentUser',
								extras: 'isTrial,isSubscriber'
							},
							null,
							function(error, data, response){
								if(error !== null && error.statusCode != 401) console.log(error);
								
								if(data) {
									data = JSON.parse(data);
								}
																
								var isTrial = isSubscriber = false;
								if(data.status=='ok') {
									isTrial = data.result.isTrial;
									isSubscriber = data.result.isSubscriber;
								}
															
								res.render('index', {
									playbackToken: playbackToken,
									songs: songs.result,
									isTrial: isTrial,
									isSubscriber: isSubscriber,
									userInfo: data.result || {}
								});
							}
						);
					}
				);
			}
		);
	});
	
	app.get('/oauth/login', function(req, res, params) {
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

	app.get('/oauth/callback', function(req, res, params) {
		var parsedUrl = url.parse(req.url, true);
		oa.getOAuthAccessToken(parsedUrl.query.oauth_token, req.session.oauth_token_secret, parsedUrl.query.oauth_verifier, 
			function(error, oauth_access_token, oauth_access_token_secret, results) {
				req.session.oauth_access_token = oauth_access_token;
				req.session.oauth_access_token_secret = oauth_access_token_secret;
				res.redirect("/");
			}
		)
	});
	
	app.get('/logout', function(req, res, params) {
		delete req.session.oauth_access_token;
		delete req.session.oauth_access_token_secret;
		
		res.redirect("/");
	})
};