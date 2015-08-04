# Spotify-Slack-Bot

Say you have a kickass team and they keep wanting to control a Spotify acccount in their workspace, but just don't know how to set it up or do it with Slack? Well, this little bot is here to save the day.

## Setup
* OSX (Central Mac)
* Spotify
* Slack

## Installation
* Clone from repository, or download .zip for the relevant version you want. Navigate to the folder in Terminal.
* `npm install`
* You'll need foreman to run the application locally so make sure you run `gem install foreman` before trying to run locally.

## Current Commands
At the moment you have to currently mention the bot to get it to run commands, the end goal is to potentially release a /command tool as well.

The current commands available are as follows.

* @botname play|start - can provide Spotify URI, nothing (plays current song), search by track or track and artist.
* @botname search|find - provide track or track and artist (currently plays first found track matching provided track name)
* @botname now playing|currently playing|current|currently|now - returns current playing song
* @botname stop|stop song|stop playing - stops the current song
* @botname next|next song|forward|skip - plays the next song in list
* @botname back|previous song|previous - plays previous song in list

## Running Locally on OS X
* Navigate to repository folder in Terminal.
* `foreman start web`


## Thoughts/Feedback
If you want to leave some feedback or your thoughts on this Slack bot, feel free to do so via Twitter (@sebastienpeek).

This project was really only done in serious boredom and out of wanting the ability to control Spotify on my Mac via my phone via Slack... Weird, I know.