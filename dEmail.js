#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');

var leaderboardStr = fs.readFileSync('leaderboard.json', 'utf8');
var leaderboard = JSON.parse(leaderboardStr);

var html = jade.renderFile('simpleTemplate.jade', { pretty : true, leaderboard: leaderboard });

fs.writeFile('index.html', html, function(err){
    console.log("index.html created at " + getDateTime());
    if (err) {
	console.log(err);
    }
});

function getDateTime() {

    var date = new Date();

    var hour = date.getHours();
    hour = (hour < 10 ? "0" : "") + hour;

    var min  = date.getMinutes();
    min = (min < 10 ? "0" : "") + min;

    var sec  = date.getSeconds();
    sec = (sec < 10 ? "0" : "") + sec;

    var year = date.getFullYear();

    var month = date.getMonth() + 1;
    month = (month < 10 ? "0" : "") + month;

    var day  = date.getDate();
    day = (day < 10 ? "0" : "") + day;

    return hour + ":" + min + ":" + sec;

}
