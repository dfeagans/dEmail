#!/usr/bin/env node

var http = require('http');
var url = require('url');
var sendResults = require('./dEmail.js');
var config = require('./config.json');

http.createServer(function (request, response) {
    var target = url.parse(request.url, true);
    var emailName = target.query.email;
    var raceID = target.query.raceID;
    var displayMessage = undefined;
    
    if (target.pathname === '/RequestResults') {
	var emailAddress = config.approvedEmails[emailName];
	if (emailAddress){
	    if (raceID){
		http.get('http://www.nascar.com/leaderboard/Series_1/2014/' + raceID  + '/1/leaderboard.json', function(){
		    

		});
	    }
	    else {
		getMostRecentLeaderboard;
	    }
	    sendResults(emailAddress);
	    displayMessage = "Results sent to " + emailAddress;
	} else {
	    displayMessage = "Email Not Approved";
	}
    } else {
	displayMessage = 'Please use dev.okdane.com/RequestResults?email=firstPartOfEmail syntax';
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(displayMessage);
}).listen(8080);


function getMostRecentLeaderboard(){
    return "TEST"
}
