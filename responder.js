var Responder;

var ScriptRunner = require('./scriptrunner.js');

Responder = (function() {

	var scriptrunner = new ScriptRunner();

	Responder.prototype.respondToMessage = function(message, userObject, slackName, res) {
		console.log("respondToMessage() - " + message);
		// Lowercase version for easy parsing
		var text = message.text.toLowerCase();
		// Orginal version for track id parsing
		var originalText = message.text;

		if (message.type === 'message' && 
			(text != null) && 
			(message.channel != null) && 
			(slackName != userObject.name)) {

				if (~text.indexOf("u08cg0kcp")) {
					// message to spotify bot directly
					if (~text.indexOf("now playing") || ~text.indexOf("currently playing")) {

						scriptrunner.getState(function(err, state) {
							if (~state.indexOf("play")) {
								scriptrunner.getTrack(function(err, track) { 
									var artist = track.artist;
									var name = track.name;
									res("Currently listening to " + name + " by " + artist);
								});
							} else {
								res("Spotify is currently "+ state);
							};
						})

					} else if (~text.indexOf("stop song") || (~text.indexOf("stop playing"))) {
						scriptrunner.stop(function(callback) {
							res("Stopping!");
						});
					} else if (~text.indexOf("start song") || (~text.indexOf("start playing")) || (~text.indexOf("play song"))) {

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

					} else if (~text.indexOf("next song")) {
						scriptrunner.next(function(callback) {
							scriptrunner.getTrack(function(err, track) { 
									var artist = track.artist;
									var name = track.name;
									res("Now playing " + name + " by " + artist);
								});
						});
					} else if (~text.indexOf("previous song")) {
						scriptrunner.previous(function(callback) {
							scriptrunner.getTrack(function(err, track) { 
									var artist = track.artist;
									var name = track.name;
									res("Now playing " + name + " by " + artist);
								});
						});
					}
				};
		} else {
			return null;
		}

	};

});

module.exports = Responder;