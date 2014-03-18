#!/usr/bin/env node
/*
The config.json file separates the email address username and password that the emails will be sent from. It also contains a list of approved emails to send to. Each approved email can be pulled out using an identifier. It must be a JSON formatted as follows:
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
