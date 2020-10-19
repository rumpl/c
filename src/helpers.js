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
const colors = require("colors/safe");
const fs = require("fs");

//Change this if you want more or less space between file names and comments
const SPACING = 2;
//Change this value for what character should present your padding.
const PADDING = " ";

/**Prints a coloured node name, padding, and it's assigned comment.
 * @param {string} fileName The name of the node.
 * @param {string} comment The comment for the node.
 * @param {number} maxLength The length of the
 * longest node name in the specified directory.
 * @param {string} relativeFilePathToTarget the
 * relative filepath to the target file or directory.
 */
function print(fileName, comment, maxLength, relativeFilePathToTarget) {
  comment = comment || "";
  //Removes any new lines with blank spaces.
  comment = comment.replace(/(\r\n|\n|\r)/gm, " ");
  let pad;

  /*The amount of spacing & the colouring changes 
  depending on whether 'file' is a file or a directory*/
  if (fs.statSync(relativeFilePathToTarget + "/" + fileName).isFile()) {
    pad = PADDING.repeat(maxLength - fileName.length + SPACING);
    console.log(
      // @ts-ignore - TS compiler throws an unnecessary error.
      colors.brightGreen(fileName) + pad + colors.yellow(comment)
    );
  } else {
    pad = PADDING.repeat(maxLength - fileName.length + SPACING - 1);
    console.log(
      // @ts-ignore - TS compiler throws an unnecessary error.
      colors.brightCyan(fileName + "/") + pad + colors.yellow(comment)
    );
  }
}

/* TODO: refactor printFileComments & printOnlyComments 
into one function - they're almost identical for the most part*/

/**Prints all of the files and sub-directories of a specified
 * directory, as well as their assigned comments.
 * @param {Array<string>} fileNames An array of all
 * of the file names in the specified directory.
 * @param {Array<string>} comments An array of
 * all of the comments in the specified directory.
 * @param {string} relativePathToTarget the relative filepath
 * to a directory, the content of which will be listed.
 */
helpers.printFileComments = function (
  fileNames,
  comments,
  relativePathToTarget
) {
  const maxLine = findMaxLengthOfArrayMember(fileNames);

  //For each file run the print function
  fileNames.forEach((fileName) => {
    print(fileName, comments[fileName], maxLine, relativePathToTarget);
  });
};

/**Prints only the files and sub-directories of a specified
 * directory which have comments, as well as their assigned comments.
 * @param {Array<string>} filesNames An array of all
 *  of the file names in the specified directory.
 * @param {Array<string>} comments An array of
 * all of the comments in the specified directory.
 * @param {string} relativePathToTarget the relative filepath
 * to a directory, the content of which will be listed.
 */
helpers.printOnlyComments = function (
  filesNames,
  comments,
  relativePathToTarget
) {
  //the length of longest file name
  const maxLine = findMaxLengthOfArrayMember(filesNames);

  //For each file with a comment, run the print function.
  filesNames.forEach(function (file) {
    if (comments[file])
      print(file, comments[file], maxLine, relativePathToTarget);
  });
};

/**Calculates the longest file name from all the returned files.
 * @param {Array<string>} files an array of all the file names in the
 * specified directory.
 * @returns {number} Returns the length of the longest name in the array.
 */
function findMaxLengthOfArrayMember(files) {
  return files.reduce((a, b) => {
    return b.length > a ? b.length : a;
  }, 0);
}
