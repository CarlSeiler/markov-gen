# Markov Experiment

## Introduction

This was created as an experiment for myself. I wanted to refresh my undestanding of [Markov chains](https://en.wikipedia.org/wiki/Markov_chain), and after watching the video by Omer Nevo at [PyConIsrael](https://hooktube.com/-51qWZdA8zM) I decided I would implement my own version in NodeJS.

## Usage

Developed using NodeJS 10.15.1, but doesn't really use anything crazy, so it should work in most versions of NodeJS.

You can install using npm:

    npm install

However, that is not necessary as there are no outside dependencies.  This will only be helpful if you want to use eslint, which is used in development to clean up the code.

To run, just type:

    node app.js

<<<<<<< HEAD
It will read from the input file `input.txt` by default.  This can be changed by editing the value of the constant `inputFile` in the SETUP section.  Alternatively, you can pass it as a parameter:
=======
It will read from the input file `input.txt` by default.  This can be changed by editing the value of the constant `inputFile.txt` in the SETUP section.  Alternatively, you can pass it as a parameter:
>>>>>>> b343a93a48e0826ac587cb6a34d54a710df13166

    node app.js differentinputfile.txt

The resulting output is shown on console and is saved in `output.txt`.  While some error-checking does happen, the app expects to be able to read and output these files.  

Comments are welcome on the issues page. You're welcome to grab it and use it. Keep in mind, I'm a hobbyist and dabbler.