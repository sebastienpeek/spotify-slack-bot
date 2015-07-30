var util = require('util'),
    exec = require('child_process').exec,
    applescript = require('applescript');

var ScriptRunner = (function() {

	var scripts = {
		track: {
		    file: 'get_track.applescript'
		},
		volumeUp:
		    'tell application "Spotify" to set sound volume to (sound volume + 10)',
		volumeDown:
		    'tell application "Spotify" to set sound volume to (sound volume - 10)',
		setVolume:
		    'tell application "Spotify" to set sound volume to %s',
		play:
		    'tell application "Spotify" to play',
		playTrack:
		    'tell application "Spotify" to play track "%s"',
		playPause:
		    'tell application "Spotify" to playpause',
		pause:
		    'tell application "Spotify" to pause',
		next:
		    'tell application "Spotify" to next track',
		previous:
		    'tell application "Spotify" to previous track',
		jumpTo:
		    'tell application "Spotify" to set player position to %s',
		isRunning:
		    'get running of application "Spotify"'
	};

	var scriptsPath = __dirname + '/scripts/';

	ScriptRunner.prototype.execScript = function(scriptName, param, callback){
	    if (arguments.length === 2 && typeof param === 'function'){
	        // second argument is the callback
	        callback = param;
	        param = undefined;
	    }

	    // applescript lib needs a callback, but callback is not always useful
	    if (!callback) callback = function(){};

	    var script = scripts[scriptName];

	    if (typeof script === 'string'){
	        if (typeof param !== 'undefined') script = util.format(script, param);
	        return applescript.execString(script, callback);
	    } else if (script.file){
	        return applescript.execFile(scriptsPath + script.file, callback);
	    }
	};

	ScriptRunner.prototype.createJSONResponseHandler = function(callback) {
		if (!callback) return null;
	    return function(error, result){
	        if (!error){
	            try {
	                result = JSON.parse(result);
	            } catch(e){
	                return callback(e);
	            }
	            return callback(null, result);
	        } else {
	            return callback(error);
	        }
	    };
	};

	ScriptRunner.prototype.getTrack = function(callback) {
		return this.execScript('track', this.createJSONResponseHandler(callback));
	};

});

module.exports = ScriptRunner;