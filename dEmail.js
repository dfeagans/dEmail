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
	{
	    fileName: 'image002.jpg',
	    filePath: 'images/image002.jpg',
	    cid: "image002_Title"
	},
	{
	    fileName: 'image003.jpg',
	    filePath: 'images/image003.jpg',
	    cid: "image003_Miller"
	},
	{
	    fileName: 'image004.png',
	    filePath: 'images/image004.png',
	    cid: "image004_Pennzoil"
	}
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

/**********  THIS USED FOR DEVELOPINGTHE FORMAT. I WAS SAVING THE POST-PROCESSED HTML TO INDEX.HTML FOR VIEWING. WORKS WELL WITH THE WEB.JS STATIC SERVER.

fs.writeFile('index.html', html, function(err){
    util.log("index.html created");
    if (err) {
	console.log(err);
    }
});

***********/
