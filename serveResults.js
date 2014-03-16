#!/usr/bin/env node

var http = require('http');
var url = require('url');
var util = require('util');
var sendResults = require('./dEmail.js');

http.createServer(function (request, response) {
    var target = url.parse(request.url, true);
    var emailName = target.query.email;
    var displayMessage = undefined;
    
    if (target.pathname === '/RequestResults') {
	var emailAddress = approvedEmailList(emailName);
	if (emailAddress){
	    sendResults(emailAddress);
	    displayMessage = "RESULTS SENT TO " + emailAddress;
	} else {
	    displayMessage = "NOT APPROVED EMAIL";
	}
    } else {
	displayMessage = 'Please use dev.okdane.com/RequestResults?email=firstPartOfEmail syntax';
    }

    response.writeHead(200, { 'Content-Type': 'text/plain' });
    response.end(displayMessage);
}).listen(8080);





function approvedEmailList(emailLocalPart){

    var approvedEmails = {
	dEmail500: 'dEmail500@gmail.com'
	
    };
        
    return approvedEmails[emailLocalPart];
}
