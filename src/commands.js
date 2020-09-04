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
const colors = require("colors/safe");
const { trueCasePathSync } = require("true-case-path");

const commands = module.exports;

//TODO: refactor list & filteredList into one function - they're almost identical for the most part

/**Lists all `.comment` files available within `.comments`.
 * @param {string} relativePathToTarget The relative path from the
 * current directory to the target directory.
 * @return {number} error code.
 */
commands.list = function (relativePathToTarget) {
  //Checks if the path is invalid OR a directory - returns if so.
  if (!storage.ifPathIsValidAndNotFile(relativePathToTarget)) {
    console.error("Please specify a valid directory.");
    return 1;
  }

  let comments, filesNames;

  //If there is not a '.comments', pass in an empty array
  if (storage.commentsFolderExists(relativePathToTarget)) {
    comments = storage.loadComments(relativePathToTarget);
    filesNames = storage.loadFiles(relativePathToTarget);
  } else {
    comments = [];
    filesNames = storage.loadFiles(relativePathToTarget);
  }

  /*If the current directory has no comment for itself, 
    look for one in the parent directory.*/
  if (!comments["."]) {
    comments["."] = storage.returnCurrentDirectoryParentComment(
      relativePathToTarget
    );
  }

  /*If the current directory has no comment for it's parent,
  look for one in the grandparent directory.*/
  if (!comments[".."]) {
    comments[".."] = storage.returnCurrentDirectoryGrandparentComment(
      relativePathToTarget
    );
  }

  //Prints the files and their comments.
  helpers.printFileComments(filesNames, comments, relativePathToTarget);

  return 0;
};

/**Lists only files with related `.comment` files.
 * @param {string} relativePathToTarget The relative path of the
 * node to list the contents of `.comments` directory.
 * @return {number} error code.
 */
commands.filteredList = function (relativePathToTarget) {
  if (!storage.ifPathIsValidAndNotFile(relativePathToTarget)) {
    console.error("Please specify a valid directory.");
    return 1;
  }

  let comments, fileNames;

  if (!storage.commentsFolderExists(relativePathToTarget)) {
    comments = [];
    fileNames = storage.loadFiles(relativePathToTarget);
  } else {
    fileNames = storage.loadFiles(relativePathToTarget);
    comments = storage.loadComments(relativePathToTarget);
  }

  /*If the current directory has no comment for itself, 
    look for one in the parent directory.*/
  if (!comments["."]) {
    comments["."] = storage.returnCurrentDirectoryParentComment(
      relativePathToTarget
    );
  }

  /*If the current directory has no comment for it's parent,
  look for one in the grandparent directory.*/
  if (!comments[".."]) {
    comments[".."] = storage.returnCurrentDirectoryGrandparentComment(
      relativePathToTarget
    );
  }

  helpers.printOnlyComments(fileNames, comments, relativePathToTarget);

  return 0;
};

/**Adds a comment to a file or directory.
 * @param {string} relativePathToTarget The relative path of the
 * node to set a relevant `.comment`.
 * @param {string} comment The comment to be written.
 * @return {number} error code.
 */
commands.set = function (relativePathToTarget, comment) {
  //Checks if the file is invalid
  if (!storage.ifPathIsValid(relativePathToTarget)) {
    console.error("Please specify a valid directory or file.");
    return 1;
  }

  const targetDirectoryAbsolutePathCaseCorrect = trueCasePathSync(
    path.join(path.resolve("./"), relativePathToTarget)
  );

  //If setting the comment file fails, log failure
  if (
    !storage.setCommentFile(targetDirectoryAbsolutePathCaseCorrect, comment)
  ) {
    console.log(
      `"${colors.cyan(comment)}" was applied to "${colors.cyan(
        relativePathToTarget
      )}" successfully.`
    );
    return 0;
  } else {
    console.log(`There was an error writing the comment. Try again.`);
    return 1;
  }
};

/**Removes a comment from a file.
 * @param {string} relativePathToTarget The relative path of the
 * node to delete a relevant `.comment`.
 * @return {number} error code.
 */
commands.delete = function (relativePathToTarget) {
  if (!storage.ifPathIsValid(relativePathToTarget)) {
    console.error(
      `${colors.cyan(
        relativePathToTarget
      )} is invalid, please specify a valid file or directory.`
    );
    return 1;
  }

  const absolutePathToTarget = path.resolve(
    path.join("./", relativePathToTarget)
  );

  if (storage.delete(absolutePathToTarget)) {
    console.log(
      `No comment to be deleted for ${colors.cyan(relativePathToTarget)}.`
    );
    return 1;
  } else {
    console.log(
      `${colors.cyan(relativePathToTarget)}'s comment was deleted successfully.`
    );
    return 0;
  }
};

/**Lists helper information.
 * @return {number} error code 0.
 */
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
  return 0;
};

/**Lists the current version.
 * @return {number} error code 0.
 */
commands.version = function () {
  console.log("v" + pack.version);
  return 0;
};
