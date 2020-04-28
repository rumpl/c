//!Defines the commands used in cli.

"use strict";

// Dependencies
var colors = require("colors");
var path = require("path");

var helpers = require("./helpers");
var storage = require("./storage");

var commands = module.exports;

/**Lists of all `.comment` files available within `.comments`.
 * @param root the current directory.
 */
commands.list = function (root) {
  //If no .comments directory exists, make one
  if (!storage.exists(root)) {
    storage.create(root);
  }

  //Load the comments from
  var comments = storage.loadComments(root);
  var files = storage.loadFiles(root);

  helpers.printFileComments(files, comments);
};

/** Set's
 * @param file The name of the file to add a relevant `.comment`.
 * @param comment The comment to be written/
 */
commands.setComment = function (file, comment) {
  //TODO: Fix filenames with spaces (Windows)

  if (fileComment) storage.set(file, comment);
};

//removeComment
commands.removeComment = function (folder) {
  storage.delete(folder);
};

/**
 * @param {Function} operation pee poo
 */
var ensureComments = function (operation) {
  return function () {
    var folder = arguments[0];

    if (!storage.exists(path.dirname(folder))) {
      storage.create(path.dirname(folder));
    }

    operation.apply(this, arguments);
  };
};

//For when no path is displayed:
commands.help = function () {
  console.log(
    "c usage:" +
      "\n" +
      "list, l     <DIRECTORY>                - Lists all the comments for the specified directory." +
      "\n" +
      "set, s      <FILE|DIRECTORY> <COMMENT> - Adds a new comment for the file/directory." +
      "\n" +
      "remove, rm  <FILE|DIRECTORY>           - Deletes all the comment on the file/directory."
  );
};

commands.set = ensureComments(commands.setComment);
commands.remove = ensureComments(commands.removeComment);
