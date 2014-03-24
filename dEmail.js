//This function sends the NASCAR leaderboard in a custom formatted email.
//It may be called from the command line using "node dEmail <COMPLETE_EMAIL_ADDRESS>"
//It's also exposed for use as a library, just "var dEmail = require('./dEmail.js')" and then dEmail(<COMPLETE_EMAIL_ADDRESS>);

var fs = require('fs');
var jade = require('jade');
var nodemailer = require('nodemailer');
var EMAIL_TARGET_DEFAULT = 'dEmail500@gmail.com';
var config = require('./config.json');

var emailResults = function(emailAddress){
    "use strict";
    var emailTarget = emailAddress || EMAIL_TARGET_DEFAULT;

    var transport = nodemailer.createTransport('SMTP', {
	service: 'Gmail',
	auth: {
	    user: config.email.user,
	    pass: config.email.password
	}
    });

    console.log('SMTP Configured');

    var leaderboardStr = fs.readFileSync('leaderboard.json', 'utf8');
    var leaderboard = JSON.parse(leaderboardStr);

    var htmlContent = jade.renderFile('simpleTemplate.jade', { pretty : true, leaderboard: leaderboard });

    var message = {
	from: 'dEmail500@gmail.com',
	to: emailTarget,
	subject: 'Team Penske ' + leaderboard.TrackName + ' Cup Series Practice Update',
	html: htmlContent,
	attachments:[
	    {
		fileName: 'image002.jpg',
		filePath: 'images/image002.jpg',
		cid: 'image002_Title'
	    },
	    {
		fileName: 'image003.jpg',
		filePath: 'images/image003.jpg',
		cid: 'image003_Miller'
	    },
	    {
		fileName: 'image004.png',
		filePath: 'images/image004.png',
		cid: 'image004_Pennzoil'
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
	transport.close();
    });

    /**********  THIS USED FOR DEVELOPING THE FORMAT. I WAS SAVING THE POST-PROCESSED HTML TO INDEX.HTML FOR VIEWING. WORKS WELL WITH THE WEB.JS STATIC SERVER.
		 fs.writeFile('index.html', html, function(err){
		 util.log("index.html created");
		 if (err) {
		 console.log(err);
		 }
		 });
    ***********/
};

if (require.main == module){
    emailResults(process.argv[2]);
}

module.exports = emailResults;
