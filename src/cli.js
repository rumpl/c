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
const commands = require("./commands");
const colors = require("colors/safe");

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
 * action    | String   | The `<string>` version of the flag.
 * shortFlag | String   | The `-<char>` version of the flag.
 * argCount  | Int      | The number of arguments this flag takes (longFlag or shortFlag as arg[0]).
 * method    | Function | The method that should be called, including the arguments passed to it.
 * fallback  | Function | If there are not < arguments, use fallback.
 **/
var options = [
  //help
  {
    shortFlag: "-h",
    action: "help",
    argCount: 1, //Flag
    method: function () {
      commands.help();
    },
    fallback: function () {
      error();
    },
  },
  //version
  {
    shortFlag: "-v",
    action: "version",
    argCount: 1, //Flag
    method: function () {
      commands.version();
    },
    fallback: function () {
      error();
    },
  },
  //list
  {
    shortFlag: "-l",
    action: "list",
    argCount: 2, //Flag, Directory
    method: function () {
      commands.list(arg[1]);
    },
    fallback: function () {
      commands.list(".");
    },
  },
  //remove
  {
    shortFlag: "-rm",
    action: "remove",
    argCount: 2, //Flag, File|Directory
    method: function () {
      commands.delete(arg[1]);
    },
    fallback: function () {
      error();
    },
  },
  //set
  {
    shortFlag: "-s",
    action: "set",
    argCount: 3, //Flag, file|Directory, comment
    method: function () {
      commands.set(arg[1], arg[2]);
    },
    fallback: function () {
      error();
    },
  },
];

//Loops through the array, checking if flags match & correct amount of arguments was provided - calls method if so, then exits
for (var option of options) {
  if (arg[0] == option.action || arg[0] == option.shortFlag) {
    switch (arg.length) {
      //The number of arguments specified
      case option.argCount:
        option.method();
        return 0;
      //The number of arguments specified -1
      case option.argCount - 1:
        option.fallback();
        return 0;
      //Error behaviour
      default:
        error();
        return 1;
    }
  }
}
//Did not enter the if statement, was not valid
error();
return 1;

function error() {
  console.error(colors.red("Invalid flag, please try the following:\n"));
  //Show how to use `c`
  commands.help();
}
