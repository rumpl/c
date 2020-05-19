//!Defines two helper functions.

/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

"use strict";
const helpers = module.exports;
const colors = require("colors/safe"); //Despite looking unused, is not unused.
const fs = require("fs");

const SPACING = 1; //Change this value if you want more or less space between file names and comments.
const PADDING = " "; //Change this value for what character should present your padding.

/**Prints a single file or sub-directory and it's assigned comment.
 * @param {File} file The single file.
 * @param {String} nodeComment The comment for that file.
 * @param {int} maxLine The length of the longest filename in the specified directory.
 * @param {String} dir The directory to look in for the files for the colouring.
 */
var print = function (file, nodeComment, maxLine, dir) {
  nodeComment = nodeComment || ""; //NodeComment is either equal to it's value or if it is undefined, is an empty string.
  nodeComment = nodeComment.replace(/(\r\n|\n|\r)/gm, " "); //Removes any new lines with blank spaces.

  //Calls the padding a relevant amount of times, such that the length between files and their comments is SPACING wide.
  const pad = PADDING.repeat(maxLine - file.length + SPACING);

  //If it's a file, colour it green, else cyan.
  if (fs.statSync(dir + "/" + file).isFile()) {
    console.log(colors.brightGreen(file) + pad + colors.yellow(nodeComment));
  } else {
    console.log(
      colors.brightCyan(file + "/") + pad + colors.yellow(nodeComment)
    );
  }
};

/**Prints all of the files and sub-directories of a specified directory, as well as their assigned comments.
 * @param {String} files An array of all of the file names in the specified directory.
 * @param {String} comments An array of all of the comments in the specified directory.
 */
helpers.printFileComments = function (files, comments, dir) {
  //Gets the length of the longest filename in the array - iterators through files.
  const maxLine = maxLength(files);

  //Prints the current file and it's comment //TODO: Make it look in the parent for a definition for the current directory?
  print(".", comments["."], maxLine, dir);
  print("..", comments[".."], maxLine, dir);

  //For each file run the print function.
  files.forEach(function (file) {
    print(file, comments[file], maxLine, dir);
  });
};

/**Prints only the files and sub-directories of a specified directory which have comments, as well as their assigned comments.
 * @param {String} files An array of all of the file names in the specified directory.
 * @param {String} comments An array of all of the comments in the specified directory.
 */
helpers.printOnlyComments = function (files, comments) {
  //Gets the length of the longest filename in the array - iterators through files.
  const maxLine = maxLength(files);

  //Prints the current file and it's comment
  if (comments["."]) print(".", comments["."], maxLine);

  //For each file with a comment, run the print function.
  files.forEach(function (file) {
    if (comments[file]) print(file, comments[file], maxLine);
  });
};

/**  Calculates the longest file name from all the returned files.
 * @param {String} files an array of all the file names in the specified directory.
 */
function maxLength(files) {
  return files.reduce((a, b) => {
    return b.length > a ? b.length : a;
  }, 0);
}
