//!Defines the commands used in cli.

"use strict";

// Dependencies
var colors = require("colors");
var path = require("path");

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
  //TODO: Fix filenames with spaces (Windows)
  storage.set(file, comment);
};

/** Removes a comment from a file.
 * @param {File} file The name of the file to remove the relevant `.comment`.
 */
commands.remove = function (file) {
  storage.delete(file);
};

//For when no path is displayed:
commands.help = function () {
  console.log(
    "list, l     <DIRECTORY>                - Lists all the comments for the specified directory." +
      "\n" +
      "set, s      <FILE|DIRECTORY> <COMMENT> - Adds a new comment for the file/directory." +
      "\n" +
      "remove, rm  <FILE|DIRECTORY>           - Deletes all the comment on the file/directory."
  );
};
