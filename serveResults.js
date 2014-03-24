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
    var displayMessage;

    if (target.pathname === '/favicon.ico') {
	displayMessage = "Favicon Requested";
    } else if (target.pathname === '/RequestResults') {
	console.log("\ndEmail Test");
	var emailAddress = config.approvedEmails[emailName];
	if (emailAddress) {
	    async.waterfall([
		function(callback){
		    //Part 1 determines the correct RaceID to use
		    if (raceID) {
			return callback(null, raceID);
		    } else {
			getCurrentLeaderboard(function(err, newRaceID){
			    return callback(null,newRaceID);
			});
		    }
		},
		function(properRaceID, callback){
		    //Part 2 actually tries to get the JSON data
		    getLeaderboard(properRaceID, function(err){
			return callback(null);
		    });
		},
		function(callback){
		    //Part 3 actually sends the email
		    sendResults(emailAddress);
		    return callback(null);
		}
	    ], function(err, result){
		//The final part catches any errors and displays them back to the user.
		displayMessage = result;
		response.writeHead(200, { 'Content-Type': 'text/plain' });
		console.log("END: " + displayMessage);
		response.end(displayMessage);
	    });

/****************ORIGINAL MISSING FLOW CONTROL*************************
	    if (raceID) {
		getLeaderboard(raceID, function(err){
		    if (err) {
			displayMessage=err;
			console.log("2: ErrorMessage: " + displayMessage);
		    }
		    else {
			sendResults(emailAddress);
		    }
		});
	    } else {
		getCurrentLeaderboard(function(err){
		    if (err) {
			displayMessage=err;
		    }
		    else {
			sendResults(emailAddress);
		    }
		});
	    }
	    displayMessage = 'Results sent to ' + emailAddress;
	    console.log("3: " + displayMessage);
*/
	} else {
	    displayMessage = 'Email Not Approved';
	}
    } else {
	displayMessage = 'Please use dev.okdane.com/RequestResults?email=identifier syntax';
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    console.log("4: " + displayMessage);
    response.end(displayMessage);
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
		console.log('1: Got Leaderboard for RaceID: ' + raceRequest);
		if (response.statusCode === 404) {
		    errMessage = 'RaceID (' + raceRequest +') Not Found @: ' + 'http://www.nascar.com/leaderboard/Series_1/2014/' + raceRequest  + '/1/leaderboard.json';
		}
		return callback(errMessage);
	    });
	});
    });
}

function getCurrentLeaderboard(callback){
    var err;
    var currentRaceID = 4284;
    return callback(err, currentRaceID);
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
