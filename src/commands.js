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

/**Lists all `.comment` files available within `.comments`.
 * @param {String} RelativePathToTargetNode The relative path from the
 * current directory to the target directory.
 * @return {int} error code.
 */
commands.list = function (RelativePathToTargetNode) {
  //Checks if the path is invalid OR a directory - returns if so.
  if (!storage.ifPathIsValidAndNotFile(RelativePathToTargetNode)) {
    console.error("Please specify a valid directory.");
    return 1;
  }

  let comments, files;

  //If there is not a '.comments', pass in an empty array
  if (storage.commentsFolderExists(RelativePathToTargetNode)) {
    comments = storage.loadComments(RelativePathToTargetNode);
    files = storage.loadFiles(RelativePathToTargetNode);
  } else {
    comments = [];
    files = storage.loadFiles(RelativePathToTargetNode);
  }

  /*If the current directory has no comment for itself, 
    look for one in the parent directory.*/
  if (!comments["."]) {
    comments["."] = storage.returnCurrentDirectoryParentComment(
      RelativePathToTargetNode
    );
  }

  //Prints the files and their comments.
  helpers.printFileComments(files, comments, RelativePathToTargetNode);

  return 0;
};

/** Lists only files with related `.comment` files.
 * @param {String} RelativePathToTargetNode The relative path of the
 * node to list the contents of `.comments` directory.
 * @return {int} error code.
 */
commands.filteredList = function (RelativePathToTargetNode) {
  if (!storage.ifPathIsValidAndNotFile(RelativePathToTargetNode)) {
    console.error("Please specify a valid directory.");
    return 1;
  }

  let comments, files;

  if (!storage.commentsFolderExists(RelativePathToTargetNode)) {
    comments = [];
    files = storage.loadFiles(RelativePathToTargetNode);
  } else {
    files = storage.loadFiles(RelativePathToTargetNode);
    comments = storage.loadComments(RelativePathToTargetNode);
  }

  helpers.printOnlyComments(files, comments);

  return 0;
};

//TODO: fix setting comments in the parent directory (i.e. `c -s ../c "wow!"`)

/** Adds a comment to a file or directory.
 * @param {String} RelativePathToTargetNode The relative path of the
 * node to set a relevant `.comment`.
 * @param {String} comment The comment to be written.
 * @return {int} error code.
 */
commands.set = function (RelativePathToTargetNode, comment) {
  //Checks if the file is invalid
  if (!storage.ifPathIsValid(RelativePathToTargetNode)) {
    console.error("Please specify a valid directory or file.");
    return 1;
  }

  /*If 'RelativePathToTargetNode' isn't the working directory 
  or it's parent, ensure it is case correct (for *nix)*/
  if (
    RelativePathToTargetNode != "./" &&
    RelativePathToTargetNode != "../" &&
    RelativePathToTargetNode != "." &&
    RelativePathToTargetNode != ".."
  ) {
    const workingDirectoryFullPath = path.resolve("./");
    const caseSensitiveFilePath = trueCasePathSync(
      RelativePathToTargetNode,
      workingDirectoryFullPath
    );

    RelativePathToTargetNode = caseSensitiveFilePath
      .replace(workingDirectoryFullPath, "")
      .slice(1);
  }

  //If setting the comment file fails, log there was a failure.
  if (!storage.setCommentFile(RelativePathToTargetNode, comment)) {
    console.log(
      `"${colors.cyan(comment)}" was applied to "${colors.cyan(
        RelativePathToTargetNode
      )}" successfully.`
    );
    return 0;
  } else {
    console.log(`There was an error writing the comment. Try again.`);
    return 1;
  }
};

/** Removes a comment from a file.
 * @param {String} RelativePathToTargetNode The relative path of the
 * node to delete a relevant `.comment`.
 * @return {int} error code.
 */
commands.delete = function (RelativePathToTargetNode) {
  //Checks if the RelativePathToTargetNode is invalid.
  if (!storage.ifPathIsValid(RelativePathToTargetNode)) {
    console.error("Please specify a valid file or directory.");
    return 1;
  }
  if (storage.delete(RelativePathToTargetNode) == 1) {
    console.log(`No comment to be deleted for "${RelativePathToTargetNode}"`);
  } else {
    console.log(
      RelativePathToTargetNode + " comment was deleted successfully."
    );
  }

  return 0;
};

/**Lists helper information.
 * @return {int} error code 0.
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
 * @return {int} error code 0.
 */
commands.version = function () {
  console.log("v" + pack.version);
  return 0;
};
