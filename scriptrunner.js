var util = require('util'),
    exec = require('child_process').exec,
    applescript = require('applescript');

var ScriptRunner = (function() {

	var scripts = {
		track: {
		    file: 'get_track.applescript'
		},
		state:
			'tell application "Spotify" to player state',
		play:
		    'tell application "Spotify" to play',
		playSong:
		    'tell application "Spotify" to play track "%s"',
		pause:
		    'tell application "Spotify" to pause',
		next:
		    'tell application "Spotify" to next track',
		previous:
		    'tell application "Spotify" to previous track'
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

	// Spotify Information

	ScriptRunner.prototype.getState = function(callback) {
		return this.execScript('state', callback);
	}

	ScriptRunner.prototype.getTrack = function(callback) {
		return this.execScript('track', this.createJSONResponseHandler(callback));
	};

	// Media Controls

	ScriptRunner.prototype.play = function(callback) {
		return this.execScript('play', callback);
	}

	ScriptRunner.prototype.playSong = function(track, callback) {
		console.log("track() - " + track);
		return this.execScript('playSong', track, callback);
	}

	ScriptRunner.prototype.stop = function(callback) {
		return this.execScript('pause', callback);
	}

	ScriptRunner.prototype.next = function(callback) {
		return this.execScript('next', callback);
	}

	ScriptRunner.prototype.previous = function(callback) {
		return this.execScript('previous', callback);
	}

});

module.exports = ScriptRunner;