#!/usr/bin/env node

//Requirements
"use strict";
var commands = require("./commands");

const [, , ...args] = process.argv; //Gets command line arguments

//TODO: restructure so to note use stupid if/else statements. Some kind of lookup table.

//Argument structure
//C    = program name.
//Arg0 = flag specifying function.
//Arg1 = directory if required by function.
//Arg2 = Comment if required by function.

//!Need 0 arguments passed
//HELP || NO FLAG
if (!args.length || args[0] == "-h" || args[0] == "--help") {
  commands.help();
}
//STATE VERSION
else if (args[0] == "-v" || args[0] == "--version") {
  commands.version();
}

//!Need 1 arguments passed
else if (args.length < 2) {
  console.error("A path must be specified.");
}

//LIST FILES AND RELEVANT COMMENTS
else if (args[0] == "-l" || args[0] == "--list") {
  commands.list(args[1]);
}
//REMOVE COMMENT RETAIN FILE
else if (args[0] == "-rm" || args[0] == "--remove") {
  commands.delete(args[1]);
}

//!Needs 2 arguments passed
else if (args.length < 3) {
  console.error("A path and comment must be specified.");
  return;
}

//SET
else if (args[0] == "-s" || args[0] == "--set") {
  //Combines all remaining arguments into one string.
  var comment = "";
  for (var i = 2; i < args.length; i++) {
    comment += args[i] + " ";
  }

  commands.set(args[1], comment);
}

//!Invalid flag
else {
  commands.invalid(args[0]);
}
