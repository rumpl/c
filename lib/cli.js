#!/usr/bin/env node

//Requirements
"use strict";
var commands = require("./commands");

const [, , ...args] = process.argv; //Gets command line arguments

//TODO: restructure so to note use stupid if/else statements. Some kind of lookup table.

//NO ARGS || HELP
if (!args.length || args[0] == "-h" || args[0] == "--help") {
  commands.help();
} //LIST
else if (args[0] == "-l" || args[0] == "--list") {
  if (!args[1]) {
    console.log("A path must be specified.");
    return;
  }
  commands.list(args[1]);
} //REMOVE
else if (args[0] == "-rm" || args[0] == "--remove") {
  if (!args[1]) {
    console.log("A path must be specified.");
    return;
  }
  commands.remove(args[1]);
} //SET
else if (args[0] == "-s" || args[0] == "--set") {
  if (!args[1] || !args[2]) {
    console.log("A path and comment must be specified.");
    return;
  }

  //Combines all remaining arguments into one string.
  var comment = "";
  for (i = 2; i < args.length; i++) {
    comment += args[i] + " ";
  }

  commands.set(args[1], comment);
} //VERSION
else if (args[0] == "-v" || args[0] == "--version") {
  commands.version();
} //INVALID FLAG
else {
  commands.invalid(args[0]);
}
