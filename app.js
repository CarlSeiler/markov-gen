const fs = require('fs');
const events = require('events');
var emitter = new events.EventEmitter();

var isDictionaryComplete = false;   
var theText = [];
var regex = /\s+/;                  // Split based on white spaces of any length
const order = 2;                    // Size of the current Markov state 0 means random words. 1 means random word based on last one word, etc.
const group_size = order + 1;       // Size of the chunks of words, the Markov state plus the next word.
const defaultInput = "./input.txt"  // Default source file if none on command line
var inputFile = considerArgsForInput();    // Source file for "training."  Should be text file with words.
const theLength = 75;               // Length of the generated output.

//console.log (inputFile);

// *** MAIN ****
var markovDictionary = train(theText,inputFile, isDictionaryComplete, emitTrainingComplete );

emitter.on('TrainingComplete', () => {
    generate (markovDictionary, theLength);    
    console.log ('\nDone.');
});

// *** Functions ***

function train (textArray, filename, isDictFinished, myCallback) {
    console.log ("Setting up map.");
    var dictionary = new Map();
    console.log ("Preparing to read from: " + filename);
    fs.readFile(filename, 'utf8', (error, contents) => {
        if (error) {
            console.log(error.message);
            console.log("Problem reading input.");
            process.exit(1);
            
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
                    // For each element in the text array, build a dictionary KEY that constists
                    // of an array of length order. Check to seee if it is already in the dictionary.
                    // If it is, push it on the array that holds the VALUEs. If it doesn't exist
                    // create the entry and add a single item array to the VALUEs.
                    // BUILD KEY:
                    var currentKey = buildKey(theArray, textIndex);
                    
                    if (dictionary.has(currentKey)) {
                        newItem = theArray[textIndex+order];
                        dictValue = dictionary.get(currentKey);
                        dictValue.push(newItem);
                        dictionary.set(currentKey, dictValue);
                    } else {
                        newItem = theArray[textIndex+order];
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
            function callback() {
                isDictFinished = true;
                myCallback();
           }
    
        }
    });
    console.log ("Finished reading attempt");
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
};
function sample(array) {
    // Takes an array and returns a random element 
    // This should be a string in this case.
    return array[Math.floor (Math.random() * array.length)];
}
function emitTrainingComplete() {
    emitter.emit('TrainingComplete')
};
function considerArgsForInput () {
    console.log ("Reading arguments if they exist.");
    if (process.argv.length > 2)
    {
        console.log ("Returning: " + process.argv[2]);
        return process.argv[2];
        
   }
    else {
        console.log ("Returning default value for input text file.");
        return defaultInput;
    }
}
//process.exit(0);
