var SpotifySearchAPI;
var restify = require('restify');

SpotifySearchAPI = (function() {

	var spotifyClient = restify.createJsonClient({
		url: 'https://api.spotify.com/'
	});

	SpotifySearchAPI.prototype.searchForString = function(string, callback) {
		console.log("searchForString() - " + string);
		
		var path = "/v1/search?q="
	 	var percentEncoded = encodeURIComponent(string);
		
		var trackName
		var artistName

		// Check if user has provided artist
	 	if (~string.indexOf("by")) {
	 		artistName = string.substring(string.lastIndexOf("by")+3,string.length);
	 		trackName = string.substring(string.lastIndexOf("by"), -string.length);
	 		path = path + "track:" + encodeURIComponent(trackName) + "artist:" + encodeURIComponent(artistName) + "&type=track";
	 	} else if (~string.indexOf("from")) {
	 		artistName = string.substring(string.lastIndexOf("from")+5,string.length);
	 		trackName = string.substring(string.lastIndexOf("from"), -string.length);
	 		path = path + "track:" + encodeURIComponent(trackName) + "artist:" + encodeURIComponent(artistName) + "&type=track";
	 	} else {
	 		path = path + percentEncoded + "&type=track";
	 	}

		spotifyClient.get(path, function(err, req, res, obj) {
  			if (err) {
  				// Probably should add error handling here...
  				console.log(err);
  			} else if (obj) {
				// Look into making this faster, surely it is possible...
  				var tracks = obj.tracks;
  				if (tracks.items.length > 0) {
  					if (trackName != null) {
  						for (var i = tracks.items.length - 1; i >= 0; i--) {
  							var track = tracks.items[i];
  							var trackRespName = track.name.toLowerCase();
  							console.log(trackRespName);
  							if (~trackRespName.indexOf(trackName)) {
  								callback(track.uri);
  								return;
  							}
						}
  					} else {
  						var track = tracks.items[0]
  						callback(track.uri)
  					}
  				} else {
  					callback(null);
  				}
  			}
		});
	};
});

module.exports = SpotifySearchAPI;