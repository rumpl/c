//!Defines the commands used in cli.

"use strict";

// Dependencies
var colors = require("colors");
var path = require("path");
var pack = require("../package.json");
var helpers = require("./helpers");
var storage = require("./storage");

var commands = module.exports;

/**Lists all `.comment` files available within `.comments`.
 * @param {File} root the current directory.
 */
commands.list = function (root) {
  //If no `.comments` directory exists, make one
  if (!storage.exists(root)) {
    storage.create(root);
  }

  //Load the comments & files from storage.
  var comments = storage.loadComments(root);
  var files = storage.loadFiles(root);

  //Prints the files and their comments.
  helpers.printFileComments(files, comments);
};

/** Adds or overwrites a comment to a file.
 * @param {File} file The name of the file to add a relevant `.comment`.
 * @param {String} comment The comment to be written.
 */
commands.set = function (file, comment) {
  storage.set(file, comment);
};

/** Removes a comment from a file.
 * @param {File} file The name of the file to remove the relevant `.comment`.
 */
commands.remove = function (file) {
  storage.delete(file);
};

/** Lists helper information
 *
 */
commands.help = function () {
  console.log(`Usage: c [-l  | --list <DIRECTORY|FILE>]
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
};

/** Lists the current version.
 *
 */
commands.version = function () {
  console.log("v" + pack.version);
};

/**
 * @param {any} arg The argument provided.
 */
commands.invalid = function (arg) {
  console.log("Invalid flag " + arg);
};
