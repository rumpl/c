#!/usr/bin/env node

//Requirements
"use strict";
var colors = require("colors");
var commands = require("./commands");

const [, , ...args] = process.argv; //Gets command line arguments

//NO ARGS || HELP
if (args.length < 2 || args[0] == "-h" || args[0] == "--help") {
  console.log(`
Usage: c [-l  | --list <DIRECTORY|FILE>]
         [-rm | --remove <DIRECTORY|FILE>]
         [-s  | --set <DIRECTORY|FILE> <COMMENT>]
         [-h  | --help]
         [-v  | --version]
 
Options:
  --list    | -l     Lists all the comments for the specified directory.
  --set     | -s     Sets or overwrites a new comment for the file|directory.
  --remove  | -rm    Deletes the comment for the file|directory.
  --help    | -h     Shows the help menu.
  --version | -v     States the version.`);
} //LIST
else if (args[0] == "-l" || args[0] == "--list") {
  console.log("list!");
} //REMOVE
else if (args[0] == "-rm" || args[0] == "--remove") {
  console.log("remove!");
} //SET
else if (args[0] == "-s" || args[0] == "--set") {
  console.log("list!");
} //INVALID FLAG
else {
  console.log(`Invalid flag ${args[1]}`);
}
