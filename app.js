const fs = require('fs');
const events = require('events');
var emitter = new events.EventEmitter();

var isDictionaryComplete = false;
var theText = [];
var regex = /\s+/;              // Split based on white spaces of any length
const order = 2;                // Size of the current Markov state 0 means random words. 1 means random word based on last one word, etc.
const group_size = order + 1;   // Size of the chunks of words, the Markov state plus the next word.
const inputFile = "trump.txt";  // Source file for "training."  Should be text file with words.
const theLength = 75;           // Length of the generated output.

// *** MAIN ****
var markovDictionary = train(theText,inputFile, isDictionaryComplete, emitTrainingComplete );

emitter.on('TrainingComplete', () => {
    generate (markovDictionary, theLength);    
    console.log ('\nDone.');
});

// *** Functions ***

function train (textArray, filename, isDictFinished, myCallback) {
    var dictionary = new Map();
    fs.readFile(filename, 'utf8', (err, contents) => {
        
        console.log (`Reading input file '${filename}'`);
        if (err) {
            console.log(err.message);
            console.log("Problem reading input.");
        } else {
            textArray = contents.split(regex);
            console.log(`Finished reading from '${filename}'`);
            // put the tail on the end for needed order
            var i;
            for (i = 0; i < order; i++) {
                textArray.push(textArray[i]);
            }
            //console.log ('Array of keys: ' + output);
            var itemsProcessed = 0;
            console.log ("Beginning processing and building dictionary.");
            //in python, this would use tuples as the key.  We have to kind of force things here to use
            // arrays of length of the order as the key.
            textArray.forEach((element, textIndex, theArray) => {
                // Create dictionary entries for all items except those in the tail
                if (textIndex <= textArray.length - (group_size)) {
                    var dictValue = []; // Each KEY is an array of length order and has has VALUE of
                    var newItem = "";
                    // TODO For each element in the text array, build a dictionary KEY that constists
                    // of an array of length order. Check to seee if it is already in the dictionary.
                    // If it is, push it on the array that holds the VALUEs. If it doesn't exist
                    // create the entry and add a single item array to the VALUEs.
                    // BUILD KEY:
                    var currentKey = buildKey(theArray, textIndex);
                    
                    if (dictionary.has(currentKey)) {
                        // console.log('Item exists, adding value to key.');
                        newItem = theArray[textIndex+order];
                         dictValue = dictionary.get(currentKey);
                         dictValue.push(newItem);
                         // console.log (`Adding value ${newItem} to ${currentKey}`);
                         dictionary.set(currentKey, dictValue);
                    } else {
                        newItem = theArray[textIndex+order];
                        // console.log(`Item ${currentKey} does not exist.  Added entry with value ${newItem}`);
                        dictionary.set(currentKey, [newItem] );
                    }
                    function buildKey(textArray, currentIndex) {
                        // They KEY will consist of the current item in textArray array plus however many items in our 
                        // order.  So for order 0, it will consist only of the item at that index of theText.
                        // For order 2, it will consist of the item at the index and the next two items, etc.
                        var j ;
                        thisKeyString = "";
                        thisKeyArray =[];
                        for (j = currentIndex; j < (currentIndex+order); j++) {
                            thisKeyArray.push(textArray[j]);
                            //thisKeyString = thisKeyString + " " + textArray[j]                    }
                        }
                        thisKeyString = thisKeyArray.join(" ");
                        return thisKeyString;
                    }
                }
                itemsProcessed++;
                if (itemsProcessed === theArray.length) {
                    console.log ("Dictionary build complete.");
                    callback (isDictFinished);
                }
    
            });
            //console.log (dictionary);
            //console.log (dictionary.size);
            //this originally could have failed because Array.forEach technically does not provide call back and could theoretically 
            // still be working when the forEach and have moved on to this.    This has been re-written to hopefully take
            // advantage of this situation:
            // https://stackoverflow.com/questions/18983138/callback-after-all-asynchronous-foreach-callbacks-are-completed
            //
            function callback() {
                isDictFinished = true;
                myCallback();
                
                // // Parsing test:
                // var x = "Humboldt";
                // if (dictionary.has(x)) {
                //     console.log(dictionary.get(x));
                //     console.log(dictionary.get(x).length);
                // }
                // else {
                //     console.log('Not found.');
                // }
            
    
            }
    
        }
    });
    return dictionary; 
    }

function generate (dict, len) {
    // As a place to start, pick a random set of ORDER number of words and store them in RESULT
    //
    if (group_size < len) {
        var startingIndex = Math.floor(Math.random() * dict.size);
        var next_word = ""; // Will store randomly selected next word from values based on given key
        var result = Array.from(dict.keys())[startingIndex];
        // Look up that KEY in the dictionary and randomly pick the next word, and stick it on RESULT
        next_word = sample(dict.get(result));
        result = result + " " + next_word;
        // Easier to work with arrays, so make this an array
        var result_array = result.split(" ");
        //setup our initial state
        var state = result_array.slice(result_array.length - order );
        console.log (`Current state:${state}`);
        //console.log (`Current result:${result_array.join(' ')}`);
        while (result_array.length < len) {
            next_word = sample(dict.get(state.join(' ')));
            result_array.push(next_word);
            state = result_array.slice(result_array.length - order );
        }
        console.log ("Final results: " + result_array.join(' '));
        fs.writeFile("output.txt", result_array.join(' '), (err) => {
            if (err) {
                return console.log(err);
            }
            else
            {
                console.log('File saved as output.txt');
            }
        });   
        
        
    } else {
        console.log (`The group_size must be smaller than theLength to be able to run.`);
    }
    // console.log (result.typeof);
    // var state = result; 
    // //console.log (result + ` and len = ${len}`);
    // for (i = 1; i <= len; i++) {
    //     next_word = dict.get(state)[Math.floor(Math.random() * dict.get(state).length)];
    //     result.push(next_word);
    //     state = result.slice(-result.length-order );
    // }
    // console.log (result);
};
function sample(array) {
    // Takes an array and returns a random element 
    // This should be a string in this case.
    return array[Math.floor (Math.random() * array.length)];
}
function emitTrainingComplete() {
    emitter.emit('TrainingComplete')
};
function 