var SlackResponder;

var SpotifyScript = require('./spotify/spotify_scripts.js');
var SearchAPI = require('./spotify/web_api/search_api.js');

SlackResponder = (function() {

	var spotifyScript = new SpotifyScript();
	var searchAPI = new SearchAPI();

	SlackResponder.prototype.respondToMessage = function(message, userObject, botId, res) {
		
		// Lowercase version for easy parsing
		var text = message.text.toString().toLowerCase();
		// Orginal version for botId detection and spotify uri parsing
		var originalText = message.text;
		
		// Makes updating what criteria works for bot commands now.
		var playPattern = new RegExp("^<@" + botId + ">:? (play|start)(.*)$");
		var searchPattern = new RegExp("^<@" + botId + ">:? (search|find)(.*)$");
		var currPattern = new RegExp("^<@" + botId + ">:? (now playing|currently playing|current|currently|now)$");
		var stopPattern = new RegExp("^<@" + botId + ">:? (stop|stop song|stop playing)$");
		var nextPattern = new RegExp("^<@" + botId + ">:? (next|next song|forward|skip)$");
		var prevPattern = new RegExp("^<@" + botId + ">:? (back|previous song|previous)$");

		if (message.type === 'message' && 
			(text != null) && 
			(message.channel != null)) {

				if (~originalText.indexOf(botId)) {
					
					console.log("respondToMessage() - " + message);

					// Before we do anything, we should probably check if Spotify is running, right?
					var playMatch = playPattern.exec(originalText);
					var searchMatch = searchPattern.exec(originalText);
					var stopMatch = stopPattern.exec(originalText);
					var currMatch = currPattern.exec(originalText);
					var nextMatch = nextPattern.exec(originalText);
					var prevMatch = prevPattern.exec(originalText);

					if (playMatch != null) {
						if (playMatch[2] != '') {
							if (~playMatch[2].indexOf("spotify:")) {
								var trackId = originalText.replace(/.*\<|\>/gi,'');
								spotifyScript.playSong(trackId, function(callback) {
									spotifyScript.getTrack(function(err, track) { 
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
										spotifyScript.playSong(trackId, function(callback) {

											setTimeout(spotifyScript.getTrack(function(err, track) {
												var artist = track.artist;
												var name = track.name;
												res("Now playing " + name + " by " + artist);
											}), 10000);

										});	
									} else {
										res("Sorry, I couldn't find the song you were looking for. Try again!")
									}
								});
							}
						} else {
							spotifyScript.play(function(callback) {
								spotifyScript.getTrack(function(err, track) { 
									var artist = track.artist;
									var name = track.name;
									res("Now playing " + name + " by " + artist);
								});
							});
						}
					} else if (searchMatch != null) {
						if (searchMatch[2] != '') {
							if (~searchMatch[2].indexOf("spotify:")) {
								var trackId = originalText.replace(/.*\<|\>/gi,'');
								spotifyScript.playSong(trackId, function(callback) {
									spotifyScript.getTrack(function(err, track) { 
										var artist = track.artist;
										var name = track.name;
										res("Now playing " + name + " by " + artist);
									});
								});	
							} else {
								// This is where we need to go and make a web request to the search API!
								var searchString = searchMatch[2];
								searchAPI.searchForString(searchString.substring(1), function(trackId) {
									if (trackId != null) {
										spotifyScript.playSong(trackId, function(callback) {
											spotifyScript.getTrack(function(err, track) { 
												var artist = track.artist;
												var name = track.name;
												res("Now playing " + name + " by " + artist);
											});
										});	
									} else {
										res("Sorry, I couldn't find the song you were looking for. Try again!")
									}
								});
							}
						}
					} else if (currMatch != null) {

						spotifyScript.getState(function(err, state) {
								if (~state.indexOf("playing")) {
									spotifyScript.getTrack(function(err, track) { 
										var artist = track.artist;
										var name = track.name;
										res("Currently listening to " + name + " by " + artist);
									});
								} else {
									res("Spotify is currently "+ state);
								};
							})
					} else if (stopMatch != null) {
						spotifyScript.stop(function(callback) {
							res("Stopping!");
						});
					} else if (nextMatch != null) {
						spotifyScript.next(function(callback) {
							spotifyScript.getTrack(function(err, track) { 
								var artist = track.artist;
								var name = track.name;
								res("Now playing " + name + " by " + artist);
							});
						});
					} else if (prevMatch != null) {
						spotifyScript.stop(function(callback) {
							spotifyScript.previous(function(callback) {
								spotifyScript.previous(function(callback) {
									spotifyScript.play(function(callback) {
										spotifyScript.getTrack(function(err, track) { 
											var artist = track.artist;
											var name = track.name;
											res("Now playing " + name + " by " + artist);
										});
									})	
								})
							})
						})
					} else {
						res("I don't know what you're asking me, not yet anyway...");
					}
				};
		} else {
			return null;
		}

	};

});

module.exports = SlackResponder;