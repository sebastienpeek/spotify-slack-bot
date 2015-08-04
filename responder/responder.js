var Responder;

var ScriptRunner = require('./spotify/spotify_scripts.js');
var SearchAPI = require('./spotify/web_api/search_api.js');

Responder = (function() {

	var scriptrunner = new ScriptRunner();
	var searchAPI = new SearchAPI();

	Responder.prototype.respondToMessage = function(message, userObject, botId, res) {
		console.log("respondToMessage() - " + message);
		// Lowercase version for easy parsing
		var text = message.text.toString().toLowerCase();
		// Orginal version for botId detection and spotify uri parsing
		var originalText = message.text;
		// var playPattern = /^<@U08CG0KCP>:? (play|search|start)(.*)$/i;
		
		var playPattern = new RegExp("^<@" + botId + ">:? (play|search|start)(.*)$");
		console.log(playPattern);

		if (message.type === 'message' && 
			(text != null) && 
			(message.channel != null)) {

				if (~originalText.indexOf(botId)) {

					var playMatch = playPattern.exec(originalText);
					console.log(playMatch);
					if (playMatch != null) {
						if (playMatch[2] != '') {
							if (~playMatch[2].indexOf("spotify:")) {
								var trackId = originalText.replace(/.*\<|\>/gi,'');
								scriptrunner.playSong(trackId, function(callback) {
									scriptrunner.getTrack(function(err, track) { 
										var artist = track.artist;
										var name = track.name;
										res("Now playing " + name + " by " + artist);
									});
								});	
							} else {
								// This is where we need to go and make a web request to the search API!
								var searchString = playMatch[2];
								searchAPI.searchForString(searchString.substring(1), function(trackId) {
									if (trackId != null) {
										scriptrunner.playSong(trackId, function(callback) {
											scriptrunner.getTrack(function(err, track) { 
												var artist = track.artist;
												var name = track.name;
												res("Now playing " + name + " by " + artist);
											});
										});	
									};
								});
							}
						} else {
							scriptrunner.play(function(callback) {
								scriptrunner.getTrack(function(err, track) { 
									var artist = track.artist;
									var name = track.name;
									res("Now playing " + name + " by " + artist);
								});
							});
						}
					} else {
						if (~text.indexOf("now playing") || ~text.indexOf("currently playing") || 
						~text.indexOf("current")) {
							scriptrunner.getState(function(err, state) {
								if (~state.indexOf("playing")) {
									scriptrunner.getTrack(function(err, track) { 
										var artist = track.artist;
										var name = track.name;
										res("Currently listening to " + name + " by " + artist);
									});
								} else {
									res("Spotify is currently "+ state);
								};
							})
						} else if (~text.indexOf("stop song") || ~text.indexOf("stop playing") || 
							~text.indexOf("stop")) {
								scriptrunner.stop(function(callback) {
									res("Stopping!");
								});
						} else if (~text.indexOf("next song") || ~text.indexOf("next") || 
							~text.indexOf("forward") || ~text.indexOf("skip")) {
								scriptrunner.next(function(callback) {
									scriptrunner.getTrack(function(err, track) { 
											var artist = track.artist;
											var name = track.name;
											res("Now playing " + name + " by " + artist);
										});
								});
						} else if (~text.indexOf("previous song") || ~text.indexOf("previous") || 
							~text.indexOf("back")) {
								scriptrunner.stop(function(callback) {
									scriptrunner.previous(function(callback) {
										scriptrunner.previous(function(callback) {
											scriptrunner.play(function(callback) {
												scriptrunner.getTrack(function(err, track) { 
													var artist = track.artist;
													var name = track.name;
													res("Now playing " + name + " by " + artist);
												});
											})	
										})
									})
								})
						}
					}
				};
		} else {
			return null;
		}

	};

});

module.exports = Responder;