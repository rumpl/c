//!Defines the commands used in cli.

/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

"use strict";

// Dependencies
const pack = require("../package.json");
const helpers = require("./helpers");
const storage = require("./storage");
const path = require("path");
const fs = require("fs");
const colors = require("colors/safe");
const { trueCasePathSync } = require("true-case-path");

var commands = module.exports;

/**Lists all `.comment` files available within `.comments`.
 * @param {String} dir the relative filepath to a directory, the content of which will be listed.
 */
commands.list = function (dir) {
  //Checks if the path is invalid OR a directory - returns if so.
  if (!fs.existsSync(dir) || fs.statSync(dir).isFile()) {
    console.error("Please specify a valid directory.");
    return;
  }

  var comments, files;

  //If there is not a '.comments', pass in an empty array
  if (storage.exists(dir)) {
    comments = storage.loadComments(dir);
    files = storage.loadFiles(dir);
  } else {
    comments = [];
    files = storage.loadFiles(dir);
  }

  //Prints the files and their comments.
  helpers.printFileComments(files, comments, dir);
};

/** Lists only files with related `.comment` files.
 * @param {File} dir the current directory.
 */
commands.filteredList = function (dir) {
  if (!fs.existsSync(dir) || fs.statSync(dir).isFile()) {
    console.error("Please specify a valid directory.");
    return;
  }

  var comments, files;

  if (!storage.exists(dir)) {
    comments = [];
    files = storage.loadFiles(dir);
  } else {
    files = storage.loadFiles(dir);
    comments = storage.loadComments(dir);
  }

  helpers.printOnlyComments(files, comments);
};

/** Adds or overwrites a comment to a file.
 * @param {String} file The name of the file to add a relevant `.comment`.
 * @param {String} comment The comment to be written.
 */
commands.set = function (file, comment) {
  //Checks if the file is invalid
  if (!fs.existsSync(file)) {
    console.error("Please specify a valid directory or file.");
    return;
  }

  if (file != "./" && file != "../" && file != "." && file != "..") {
    const pathUpTo = path.resolve("./");
    const trueFile = trueCasePathSync(file, pathUpTo);
    file = trueFile.replace(pathUpTo, "").replace("/", "");
  }

  storage.set(file, comment);
  console.log(
    '"' +
      colors.cyan(comment) +
      '" was applied to "' +
      colors.cyan(file) +
      '" successfully.'
  );
};

/** Removes a comment from a file.
 * @param {File} file The name of the file to remove the relevant `.comment`.
 */
commands.delete = function (file) {
  //Checks if the file is invalid.
  if (!fs.existsSync(file)) {
    console.error("Please specify a valid file or directory.");
    return;
  }
  if (storage.delete(file) == 1) {
    console.log(`No comment to be deleted for "${file}"`);
  } else {
    console.log(file + " comment was deleted successfully.");
  }
};

//Lists helper information.
commands.help = function () {
  console.log(`Usage: c [-l  | --list <DIRECTORY|FILE>]
         [-rm | --remove <DIRECTORY|FILE>]
         [-s  | --set <DIRECTORY|FILE> <COMMENT>]
         [-h  | --help]
         [-v  | --version]

Options:
  list    | -l     Lists all the comments for the specified directory.
  set     | -s     Sets or overwrites a new comment for the file|directory.
  remove  | -rm    Deletes the comment for the file|directory.
  help    | -h     Shows the help menu.
  version | -v     States the version.\n`);
};

//Lists the current version.
commands.version = function () {
  console.log("v" + pack.version);
};

/** Outputs a message stating that the flag is invalid.
 * @param {String} flag The flag provided.
 */
commands.invalid = function (flag) {
  console.log("Invalid flag " + flag + ".");
};
