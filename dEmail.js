#!/usr/bin/env node

var jade = require('jade');
var fs = require('fs');

var html = jade.renderFile('simpleTemplate.jade', 'pretty');

fs.writeFile('index.html', html, function(err){
    console.log("Compiled index.html");
    if (err) {
	console.log(err);
    }
});

