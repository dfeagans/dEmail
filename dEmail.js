#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');

var html = jade.renderFile('simpleTemplate.jade', { pretty : true});

fs.writeFile('index.html', html, function(err){
//    console.log("Compiled index.html");
    console.log(html);
    if (err) {
	console.log(err);
    }
});

