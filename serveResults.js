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
	console.log("\ndEmail Test");
	var emailAddress = config.approvedEmails[emailName];
	async.waterfall([
	    //Part 1 makes sure it's a valid request and if so, determines the correct RaceID to use
	    function(callback){
		if (!emailAddress) {
		    return callback('Email Not Approved');
		}
		if (raceID) {
		    console.log('raceID given.');		    
		    callback(null, raceID);
		} else {
		    console.log('noRaceID given');
		    getCurrentRaceID(callback);
		}
	    },
	    //Part 2 actually tries to get the JSON data
	    function(properRaceID, callback){
		console.log("Part2");
		getLeaderboard(properRaceID, callback);
	    },
	    //Part 3 actually sends the email
	    function(callback){
		console.log('PART 3 Send EMAIL');
		sendResults(emailAddress, function(err){
		    callback(err, 'Email Sent to: ' + emailAddress);
		});
	    }
	], function(err, result){
	    //The final part catches any errors and displays them back to the user.
	    response.writeHead(200, { 'Content-Type': 'text/plain' });
	    response.end(err || result);
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
		console.log('Got Leaderboard for RaceID: ' + raceRequest);
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
    var seedRaceID = 4282;
    var err;
    var currentID;

    //There are 36 races a season, I just use 40 to be safe due to the all-star race and tests.
    var raceList = range(seedRaceID, seedRaceID + 40);
    currentID = Math.max.apply(Math,raceList);
    return callback(err, currentID);
}

function raceAvailable(raceIDtoTest){
    var options = {method: 'HEAD',
		   host: 'www.nascar.com',
		   post: 80,
		   path: '/leaderboard/Series_1/2014/' + raceIDtoTest  + '/1/leaderboard.json'
		  };
    var req = http.request(options,function(res){
	if (res.statusCode === 200) {
	    return 1;
	} else {
	    return 0;
	}
    });
    req.end();
}
