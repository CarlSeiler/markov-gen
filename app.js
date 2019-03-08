// 
const fs = require ('fs');
const stream = require('stream');
var output = [];
var dictionary = new Map();
var regex = /\s+/;

const order = 4;
const inputFile = "input.txt";


fs.readFile(inputFile,'utf8', (err, contents) => {
    if (err) {
        console.log (err.message);
        console.log ("Problem reading input.");
    } else {
    output = contents.split(regex);
    console.log("Input read from " + inputFile + '.');
    // put the tail on the end for needed order
    var i;
    for (i = 0; i < order; i++ ) {
        output.push(output[i]);
    }
    console.log ('Array of keys: ' + output);
    output.forEach ((element,outputIndex) => {
        // Do not create dictionary entries for items added to the tail
        if (outputIndex <= output.length-(order+1)) { 
        var dictValue = [];
        var newItem = [];
        if (dictionary.has(element)) {
            console.log('Element exists, adding value to key.');
            newItem =  fillElements(output,outputIndex);
            dictValue = dictionary.get(element);
            dictValue.push(newItem);
            dictionary.set(element, dictValue);
        } else {
            console.log('Element does not exist in dictionary, adding key-value pair.');
            dictionary.set (element,  [fillElements(output,outputIndex)] );
        }
    function fillElements(o,oi) {
        var j;
        arrOfValues = [];
        for (j = 1; j <= order; j++) {
            arrOfValues.push(o[oi+j]);
        }
        return arrOfValues;

    }
    }
       
});
console.log (dictionary);


    }
});


