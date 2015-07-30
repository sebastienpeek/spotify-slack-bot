var Responder;

var ScriptRunner = require('./scriptrunner.js');

Responder = (function() {

	var scriptrunner = new ScriptRunner();

	Responder.prototype.respondToMessage = function(message, userObject, botId, res) {
		console.log("respondToMessage() - " + message);
		// Lowercase version for easy parsing
		var text = message.text.toLowerCase();
		// Orginal version for botId detection and spotify uri parsing
		var originalText = message.text;

		if (message.type === 'message' && 
			(text != null) && 
			(message.channel != null)) {

				if (~originalText.indexOf(botId)) {
					// message to spotify bot directly
					if (~text.indexOf("now playing") || ~text.indexOf("currently playing")) {

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

					} else if (~text.indexOf("stop song") || (~text.indexOf("stop playing")) || 
						(~text.indexOf("stop"))) {
							scriptrunner.stop(function(callback) {
								res("Stopping!");
							});
					} else if (~text.indexOf("start song") || (~text.indexOf("start playing")) ||
						(~text.indexOf("play song")) || (~text.indexOf("play")) || 
						(~text.indexOf("start"))) {
							// Check to make sure the user isn't defining what track to play next!
							if (~text.indexOf("spotify:")) {
								var trackId = originalText.replace(/.*\<|\>/gi,'');
								scriptrunner.playSong(trackId, function(callback) {
									scriptrunner.getTrack(function(err, track) { 
										var artist = track.artist;
										var name = track.name;
										res("Now playing " + name + " by " + artist);
									});
								});	
							
							} else {
								scriptrunner.play(function(callback) {
									scriptrunner.getTrack(function(err, track) { 
											var artist = track.artist;
											var name = track.name;
											res("Now playing " + name + " by " + artist);
										});
								});
							}

					} else if (~text.indexOf("next song") || (~text.indexOf("next")) || 
						(~text.indexOf("forward")) || (~text.indexOf("skip"))) {
							scriptrunner.next(function(callback) {
								scriptrunner.getTrack(function(err, track) { 
										var artist = track.artist;
										var name = track.name;
										res("Now playing " + name + " by " + artist);
									});
							});
					} else if (~text.indexOf("previous song") || (~text.indexOf("previous")) || 
						(~text.indexOf("back"))) {

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
				};
		} else {
			return null;
		}

	};

});

module.exports = Responder;