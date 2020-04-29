//!Defines two helper functions.

/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

"use strict";
var underscore = require("underscore");
var helpers = module.exports;
var colors = require("colors"); //Despite looking unused, is not unused.
var fs = require("fs");

const SPACING = 1; //Change this value if you want more or less space between file names and comments.
const PADDING = " "; //Change this value for what character should present your padding.

/**Prints a single file or sub-directory and it's assigned comment.
 * @param {File} node The single file.
 * @param {String} nodeComment The comment for that file.
 * @param {any} maxLine The length of the longest filename in the specified directory.
 */
var print = function (file, nodeComment, maxLine) {
  nodeComment = nodeComment || ""; //NodeComment is either equal to it's value or if it is undefined, is an empty string.
  nodeComment = nodeComment.replace(/(\r\n|\n|\r)/gm, " "); //Removes any new lines with blank spaces.

  var pad = " "; //Padding between filename and comment.

  //Calls the padding a relevant amount of times, such that the length between files and their comments is SPACING wide.
  underscore.times(maxLine - file.length + SPACING, function () {
    pad += PADDING;
  });

  if (fs.statSync(file).isFile()) {
    console.log(file.brightGreen + pad + nodeComment.yellow);
  } else {
    console.log(file.brightCyan + pad + nodeComment.yellow);
  }
};

/**Prints all of the files and sub-directories of a specified directory, as well as their assigned comments.
 * @param {String} files An array of all of the file names in the specified directory.
 * @param {String} comments An array of all of the comments in the specified directory.
 */
helpers.printFileComments = function (files, comments) {
  //Gets the length of the longest filename in the array - iterators through files.
  var maxLine = underscore.max(files, function (file) {
    return file.length;
  }).length;

  //Prints the current file and it's comment //TODO: Make it look in the parent for a definition for the current directory?
  print(".", comments["."], maxLine);

  //For each file run the print function.
  files.forEach(function (file) {
    print(file, comments[file], maxLine);
  });
};

/**Prints only the files and sub-directories of a specified directory which have comments, as well as their assigned comments.
 * @param {String} files An array of all of the file names in the specified directory.
 * @param {String} comments An array of all of the comments in the specified directory.
 */
helpers.printOnlyComments = function (files, comments) {
  //Gets the length of the longest filename in the array - iterators through files.
  var maxLine = underscore.max(files, function (file) {
    return file.length;
  }).length;

  //Prints the current file and it's comment
  if (comments["."]) print(".", comments["."], maxLine);

  //For each file with a comment, run the print function.
  files.forEach(function (file) {
    if (comments[file]) print(file, comments[file], maxLine);
  });
};
