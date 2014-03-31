#!/usr/bin/env node
/*
The config.json file separates the email address username and password that the emails will be sent from.
It also contains a list of approved emails to send to. Each approved email can be pulled out using an identifier.

The config.json file must be in the below format:
{
    "email": {
	"user": "emailAddresstoSendFrom@email.com",
	"password": "unbelievablyStrongPasswordForYourAccount"
    },
    "approvedEmails": {
	"identifier1": "fullEmail@1.com"
	"identifier2": "fullEmail@2.com"
	"identifier3": "fullEmail@3.com"
    }
}

*/

var http = require('http');
var url = require('url');
var fs = require('fs');
var async = require('async');
var sendResults = require('./dEmail.js');
var config = require('./config.json');

http.createServer(function (request, response) {
    var target = url.parse(request.url, true);
    var emailName = target.query.email;
    var raceID = target.query.raceID;

    if (target.pathname === '/RequestResults') {
	var emailAddress = config.approvedEmails[emailName];
	async.waterfall([
	    //Part 1 makes sure it's a valid request and if so, determines the correct RaceID to use
	    function(callback){
		if (!emailAddress) {
		    return callback('Email Not Approved');
		}
		if (raceID) {
		    callback(null, raceID);
		} else {
		    getCurrentRaceID(callback);
		}
	    },
	    //Part 2 actually tries to get the JSON data
	    function(properRaceID, callback){
		getLeaderboard(properRaceID, callback);
	    },
	    //Part 3 actually sends the email
	    function(callback){
		sendResults(emailAddress, callback);
	    }
	], function(err){
	    //The final part catches any errors and displays them back to the user.
	    response.writeHead(200, { 'Content-Type': 'text/plain' });
	    response.end(err || 'Email Sent to: ' + emailAddress);
	});
    }
}).listen(8080);

function getLeaderboard(raceRequest, callback){
    var leaderboardJSON = '';
    var errMessage;
    http.get('http://www.nascar.com/leaderboard/Series_1/2014/' + raceRequest  + '/1/leaderboard.json', function(response){
	response.on('data', function(chunk){
	    leaderboardJSON += chunk;
	});
	response.on('end', function(){
	    fs.writeFile('leaderboard.json', leaderboardJSON, function (err){
		if (response.statusCode === 404) {
		    errMessage = 'RaceID (' + raceRequest +') Not Found @ ' + 'http://www.nascar.com/leaderboard/Series_1/2014/' + raceRequest  + '/1/leaderboard.json';
		}
		return callback(errMessage);
	    });
	});
    });
}

function range(start, end) {
    var incArray = [];
    for (var i = start; i <= end; i++) {
	incArray.push(i);
    }
    return incArray;
}

function getCurrentRaceID(callback){
    //Daytona was the first race of 2014, it's raceID was 4282.
    var FIRST_RACE_ID = 4283;
    var err;
    var currentID;

    //There are 36 races a season, I just use 40 to be safe due to the all-star race and tests.
    var raceList = range(FIRST_RACE_ID, FIRST_RACE_ID + 40);
    async.map(raceList, raceAvailable, function(err, testedRaceIDs){
	currentID = Math.max.apply(Math, testedRaceIDs);
	return callback(err, currentID);
    });
}

function raceAvailable(raceIDtoTest, callback){
    var options = {method: 'HEAD',
		   host: 'www.nascar.com',
		   post: 80,
		   path: '/leaderboard/Series_1/2014/' + raceIDtoTest  + '/1/leaderboard.json',
		   agent: false
		  };

    var req = http.request(options,function(res){
	if (res.statusCode === 200 && res.headers['content-type'] === 'application/json') {
	    callback(null, raceIDtoTest);
	} else {
	    callback(null, 0);
	}
    });
    
    req.on('error', function(err) {
	callback(err.message);
    });
    
    req.end();
}
