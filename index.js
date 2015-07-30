// Slack Bot template
var Slack, autoMark, autoReconnect, slack, token, Responder, listening, Responder, botId;
Slack = require('slack-client');
Responder = require('./responder.js');
token = 'xoxb-8424019431-t2XR3PJdVOM2FKzaAM96koba';
autoReconnect = true;
autoMark = true;
slack = new Slack(token, autoReconnect, autoMark);
listening = true;

slack.on('open', function() {
  botId = slack.self.id;
  console.log("Welcome to Slack. You are @" + slack.self.name + " of " + slack.team.name + " with the id of " + slack.self.id);
});

slack.on('message', function(message) {

	var channel, channelError, channelName, errors, responder, text, textError, ts, type, typeError, user, userName;

  	channel = slack.getChannelGroupOrDMByID(message.channel);
  	user = slack.getUserByID(message.user);
  	type = message.type;
  	text = message.text.toString().toLowerCase();
  	ts = message.ts;
  	channelName = (channel != null ? channel.is_channel : void 0) ? '#' : '';
  	channelName = channelName + (channel ? channel.name : 'UNKNOWN_CHANNEL');
  	userName = (user != null ? user.name : void 0) != null ? "@" + user.name : "UNKNOWN_USER";

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