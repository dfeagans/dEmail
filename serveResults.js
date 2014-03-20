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
var sendResults = require('./dEmail.js');
var config = require('./config.json');

http.createServer(function (request, response) {
    var target = url.parse(request.url, true);
    var emailName = target.query.email;
    var raceID = target.query.raceID;
    var displayMessage;

    if (target.pathname === '/RequestResults') {
	var emailAddress = config.approvedEmails[emailName];
	if (emailAddress) {
	    if (raceID) {
		getLeaderboard(raceID, function(err){
		    if (err) {
			displayMessage=err;
		    }
		    else {
			sendResults(emailAddress);
		    }
		});
	    }
	    else {
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
	} else {
	    displayMessage = 'Email Not Approved';
	}
    } else {
	displayMessage = 'Please use dev.okdane.com/RequestResults?email=identifier syntax';
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(displayMessage);
}).listen(8080);

function getLeaderboard(raceRequest, callback){
    var leaderboardJSON = '';
    http.get('http://www.nascar.com/leaderboard/Series_1/2014/' + raceRequest  + '/1/leaderboard.json', function(response){
	response.on('data', function(chunk){
	    leaderboardJSON += chunk;
	});
	response.on('end', function(){
	    fs.writeFile('leaderboard.json', leaderboardJSON, function (err){
		console.log('Got Leaderboard for RaceID: ' + raceRequest);
		return callback(err);
	    });
	});
    });
}

function getCurrentLeaderboard(callback){
    var err;
    return callback(err);
}
