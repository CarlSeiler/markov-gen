// 
const fs = require ('fs');
const stream = require('stream');
var output = [];
var regex = /\s+/;

const order = 2;
const inputFile = "semple.txt";


fs.readFile(inputFile,'utf8', (err, contents) => {
    if (err) {
        console.log (err.message);
        console.log ("Problem reading input.");
    } else {
    output = contents.split(regex);
    console.log("Input read from " + inputFile + '.');
    }
});



