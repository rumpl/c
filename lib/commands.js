//!Defines the commands used in cli.

"use strict";

// Dependencies
var colors = require("colors");
var path = require("path");

var helpers = require("./helpers");
var storage = require("./storage");

var commands = module.exports;

//Commands.list
commands.list = function (root) {
  if (!storage.exists(root)) {
    storage.create(root);
  }

  var comments = storage.loadComments(root);
  var files = storage.list(root);

  helpers.printFileComments(files, comments);
};

//setComment
commands.setComment = function (folder, comment) {
  storage.set(folder, comment);
};

//removeComment
commands.removeComments = function (folder) {
  storage.deleteComments(folder);
};

//Ensuring the validity of the path
var ensureComments = function (cb) {
  return function () {
    var folder = arguments[0];

    if (!storage.exists(path.dirname(folder))) {
      storage.create(path.dirname(folder));
    }

    cb.apply(this, arguments);
  };
};

//For when no path is displayed:
commands.help = function () {
  console.log(
    "c usage:" +
      "\n" +
      "list, l     <DIRECTORY>                - Lists all the comments for the specified directory." +
      "\n" +
      "set, s      <file|directory> <comment> - Adds a new comment for the file/directory." +
      "\n" +
      "remove, rm  <FILE|DIRECTORY>           - Deletes all the comment on the file/directory."
  );
};

commands.set = ensureComments(commands.setComment);
commands.remove = ensureComments(commands.removeComments);
