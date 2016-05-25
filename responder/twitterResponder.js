var TwitterResponder;

var SearchAPI = require('./spotify/web_api/search_api.js');
var twitter = require('twitter-text');

TwitterResponder = (function() {

	var searchAPI = new SearchAPI();

	TwitterResponder.prototype.respondToTweet = function(tweet, res) {
		
		console.log("respondToTweet() - " + tweet.text.toString());

		var originalTweet = tweet.text.toLowerCase();
		var removeFirstHash = originalTweet.replace("#sbhack", "");
		var removeSecondHash = removeFirstHash.replace("#workatsportsbet", "");
		var removeThirdHash = removeSecondHash.replace("#sbrekt", "");
		var removeSlashes = removeThirdHash.replace("/", "");

		var removeUsernamesRegex = /(^|[^@\w])@(\w{1,15})\b/g
		var removeUsernames = removeSlashes.replace( removeUsernamesRegex, "");
		
		var originalText = removeUsernames.trim();

		console.log("originalText - " + originalText);
		
		// Makes updating what criteria works for bot commands now.
		var playPattern = new RegExp("^(play|start)(.*)$");
		var playMatch = playPattern.exec(originalText);

		if (playMatch != null) {
			if (playMatch[2] != '') {
				if (~playMatch[2].indexOf("spotify:")) {
					var trackId = originalText.replace(/.*\<|\>/gi,'');
					res(trackId);
				} else {
					// This is where we need to go and make a web request to the search API!
					var searchString = playMatch[2];
					searchAPI.searchForString(searchString.substring(1), function(trackId) {
						if (trackId != null) {
							res(trackId);
						} else {
							res("Sorry, I couldn't find the song you were looking for. Try again!")
						}
					});
				}
			}
		}
	};

});

module.exports = TwitterResponder;