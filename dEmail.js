#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');
var util = require('util');

var leaderboardStr = fs.readFileSync('leaderboard.json', 'utf8');
var leaderboard = JSON.parse(leaderboardStr);

var html = jade.renderFile('simpleTemplate.jade', { pretty : true, leaderboard: leaderboard });

fs.writeFile('index.html', html, function(err){
    util.log("index.html created");
    if (err) {
	console.log(err);
    }
});
