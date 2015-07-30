var Responder;

var spotify = require('./scriptrunner.js');

Responder = (function() {

	Responder.prototype.respondToMessage = function(message, userObject, slackName, res) {
		console.log("respondToMessage() - " + message);
		var text;
		text = message.text.toLowerCase();

		if (message.type === 'message' && 
			(text != null) && 
			(message.channel != null) && 
			(slackName != userObject.name)) {

				if (~text.indexOf("u08cg0kcp")) {
					// message to spotify bot directly
					console.log('talking to me directly...');
					if (~text.indexOf("now playing") || ~text.indexOf("currently playing")) {
						spotify.getTrack(function(err, track){ 
							var artist = track.artist;
							var name = track.name;
							res("Currently listening to " + name + " by " + artist);
						});
					}		
				};
		} else {
			return null;
		}

	};

});

module.exports = Responder;