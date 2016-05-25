// Slack Bot template
var Slack, autoMark, autoReconnect, slack, token, SlackResponder, listening, TwitterResponder, botId, sleep;
Slack = require('slack-client');
SlackResponder = require('./responder/slackResponder.js');
TwitterResponder = require('./responder/twitterResponder.js');
token = 'xoxb-8424019431-t2XR3PJdVOM2FKzaAM96koba';
sleep = require('sleep');
autoReconnect = true;
autoMark = true;
slack = new Slack(token, autoReconnect, autoMark);
listening = true;

var SpotifyScript = require('./responder/spotify/spotify_scripts.js');
var spotifyScript = new SpotifyScript();
var playlist = [];

// Twitter Integration
var util = require('util'),
    twitter = require('twitter');
var client = new twitter({
    consumer_key: 'Wwq1ZRVCvH0KRjsUYLPAhoIRY',
    consumer_secret: 'vxIK0q0jA7y3uyuwTCntugwRXBSWa3VHx7ohLJdAHGO2VNzquR',
    access_token_key: '23934002-rvuVqozivuyJJTxOGMqS5CKsZ4FjubvFXkpEQ9XGM',
    access_token_secret: 'k23xZ1OtPBwrm5RUBIsCa1Z2EOUvPKkgYpZkaCf1wN25q'
});

client.stream('statuses/filter', { track: '#sbhack, #workatsportsbet, #sbrekt' }, function(stream) {

    stream.on('data', function(data) {
      var twitterResponder = new TwitterResponder();

      twitterResponder.respondToTweet(data, function(res) {
        spotifyScript.getState(function(err, state) {

          console.log("We're currently "+ state.position + " into the song.");
            if (state.state != 'playing' || state.position > 300) {
              spotifyScript.playSong(res, function(callback) {
                spotifyScript.getTrack(function(err, track) { 
                  var artist = track.artist;
                  var name = track.name;
                  console.log("Now playing " + name + " by " + artist);
                });
                console.log(res);
              });
            } else {
              console.log('Currently playing a song, sorry m9');
            }
        });
      });
    });
});

/*
slack.on('open', function() {
  botId = slack.self.id;
  console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name + " with id " + slack.self.id);
});

slack.on('message', function(message) {

	var channel, channelError, channelName, errors, responder, text, textError, ts, type, typeError, user, userName;

  	channel = slack.getChannelGroupOrDMByID(message.channel);
  	user = slack.getUserByID(message.user);

  	responder = new Responder();
    responder.respondToMessage(message, user, botId, function(res) {
      var response = res;
      if (response != null) {
        channel.send(response);
        return console.log("@" + slack.self.name + " responded with \"" + response + "\"");
      }
    });

});

slack.on('error', function(error) {
  return console.error("Error: " + error);
});

slack.login();
*/