#!/usr/bin/env node
"use strict";

var fs = require('fs');
var jade = require('jade');
var nodemailer = require('nodemailer');

var transport = nodemailer.createTransport("SMTP", {
        service: 'Gmail',
        auth: {
            user: "dEmail500@gmail.com",
            pass: ""
        }
    });

console.log('SMTP Configured');

var leaderboardStr = fs.readFileSync('leaderboard.json', 'utf8');
var leaderboard = JSON.parse(leaderboardStr);

var htmlContent = jade.renderFile('simpleTemplate.jade', { pretty : true, leaderboard: leaderboard });

var message = {
    from: 'dEmail500@gmail.com',
    to: 'dEmail500@gmail.com',
    subject: 'Team Penske ' + leaderboard.TrackName + ' Cup Series Practice Update',
    html: htmlContent,
    attachments:[
	
    ]
};

console.log('Sending Mail');

transport.sendMail(message, function(error){
    if(error){
        console.log('Error occured');
        console.log(error.message);
        return;
    }
    console.log('Message sent successfully!');
    // if you don't want to use this transport object anymore, uncomment following line
    transport.close(); // close the connection pool
});

/**********

fs.writeFile('index.html', html, function(err){
    util.log("index.html created");
    if (err) {
	console.log(err);
    }
});

***********/
