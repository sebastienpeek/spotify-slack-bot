var Responder;

var ScriptRunner = require('./scriptrunner.js');

Responder = (function() {

	var scriptrunner = new ScriptRunner();

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
					if (~text.indexOf("now playing") || ~text.indexOf("currently playing")) {
						scriptrunner.getTrack(function(err, track){ 
							var artist = track.artist;
							var name = track.name;
							res("Currently listening to " + name + " by " + artist);
						});
					} else if (~text.indexOf("play song")) {
						scriptrunner.play();
					}
				};
		} else {
			return null;
		}

	};

});

module.exports = Responder;