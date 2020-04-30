#!/usr/bin/env node
//TODO: add a .commentsignore file for files which you would like to ignore from the --list.
/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

"use strict";
var commands = require("./commands");

const [, , ...arg] = process.argv; //Gets command line arguments
/**
 * * Argument structure:
 *
 * C    | program name.                       | <Required>
 * Arg0 | flag specifying function.           | <Required>
 * Arg1 | directory if required by function.  | <Flag dependant>
 * Arg2 | Comment if required by function.    | <Flag dependant>
 */

/**Add new arguments here!
 * * Object structure:
 * longFlag  | String   | The `--<string>` version of the flag.
 * shortFlag | String   | The `-<char>` version of the flag.
 * argCount  | Int      | The number of arguments this flag takes (longFlag or shortFlag as arg[0]).
 * method    | Function | The method that should be called, including the arguments passed to it.
 **/
var flags = [
  {
    longFlag: "--help",
    shortFlag: "-h",
    argCount: 1, //Flag
    method: function () {
      commands.help();
    },
  },
  {
    longFlag: "--version",
    shortFlag: "-v",
    argCount: 1, //Flag
    method: function () {
      commands.version();
    },
  },
  {
    longFlag: "--list",
    shortFlag: "-l",
    argCount: 2, //Flag, Directory
    method: function () {
      commands.list(arg[1]);
    },
  },
  {
    longFlag: "--remove",
    shortFlag: "-r",
    argCount: 2, //Flag, File|Directory
    method: function () {
      commands.delete(arg[1]);
    },
  },
  {
    longFlag: "--set",
    shortFlag: "-s",
    argCount: 3, //Flag, file|Directory, comment
    method: function () {
      commands.set(arg[1], arg[2]);
    },
  },
];

//Loops through the array, checking if flags match & correct amount of arguments was provided - calls method if so
for (var flag of flags) {
  if (
    (arg[0] == flag.longFlag || arg[0] == flag.shortFlag) &&
    arg.length == flag.argCount
  ) {
    flag.method();
    return;
  }
}

//If an argument was provided, prints an error message
if (arg.length) {
  console.error(
    "Invalid flag".underline.red + ", please try the following:\n".red
  );
}

//Show how to use `c`
commands.help();
