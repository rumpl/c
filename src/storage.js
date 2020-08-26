//!This file contains functions related to checking for, adding and deleting `.comment` files and `.comments` directories.

/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

"use strict";

const fs = require("fs"); //FileSystem
const path = require("path"); //Paths

var storage = module.exports;

//Constants representing the directory name & file extension, respectively.
const DIRECTORY = ".comments";
const EXTENSION = ".comment";

/** Sets a `.comment` file for a specific file.
 * @param {File} file a provided directory from the file tree.
 * @param {String} comment The comment to be written.
 * @returns {void} Exit the program.
 */
storage.set = function (file, comment) {
  //Check if `.comments` exists, makes it if not.
  if (!storage.exists(path.dirname(file))) {
    storage.create(path.dirname(file));
  }

  //TODO: fix setting for . uses actual file name
  var commentsFile = getCommentsFile(file); //Gets the file path
  var id = fs.openSync(commentsFile, "a", "0644");

  fs.writeSync(id, comment + "\n", null, "utf8");

  fs.closeSync(id);
};

/**Deletes a `.comment` file, and deletes `.comments` if it is left empty.
 * @param {File} file The name of the file whose `.comment` needs to be deleted.
 * @returns {int} 0 if successful, 1 if unsuccesful.
 */
storage.delete = function (file) {
  //If there is no `.comments` directory...
  if (!storage.exists(path.dirname(file))) {
    return 1;
  }

  var commentsFile = getCommentsFile(file);

  //If the `file.comment` does not exist...
  if (!fs.existsSync(commentsFile)) {
    return 1;
  }

  fs.unlinkSync(commentsFile);

  //If the `.comments` directory is now empty...
  if (storage.loadFiles(path.join(path.dirname(file), DIRECTORY)).length == 0) {
    fs.rmdirSync(path.join(path.dirname(file), DIRECTORY));
  }

  return 0;
};

/**Checks if `.comments` exists.
 * @param {File} dir the path to the current directory.
 * @returns {Boolean} true if `.comments` is present in the directory.
 * */
storage.exists = function (dir) {
  var exists = fs.existsSync(path.join(dir, DIRECTORY));

  if (exists) {
    return fs.statSync(dir).isDirectory();
  }

  return false;
};

/**Creates a `.comments` directory.
 * @param {File} dir a provided directory from the file tree.
 */
storage.create = function (dir) {
  fs.mkdirSync(path.join(dir, DIRECTORY), "0755");
};

/** Loads the names of all files & directories in the current directory EXCEPT `.comments`
 * @param {File} dir a provided directory from the file tree.
 * @returns An array of filenames.
 */
storage.loadFiles = function (dir) {
  return fs.readdirSync(dir).filter((file) => {
    return file !== DIRECTORY;
  });
};

/** Loads the comments of all files & directories in the current directory.
 * @param {string} dir the path to the current directory.
 * @returns {array} A string array of comments.
 */
storage.loadComments = function (dir) {
  var comments = [];
  var commentDir = fs.readdirSync(path.join(dir, DIRECTORY));

  commentDir.forEach(function (file) {
    comments[path.basename(file, EXTENSION)] = fs
      .readFileSync(path.join(dir, DIRECTORY, file))
      .toString();
  });

  return comments;
};

//TODO: as below, for ../ directory?

/** A function which returns the comment associated with the current
 *  directory from it's the parent directory.
 *  @param {string} dir the path to the current directory.
 *  @returns {string} The comment associated with the directory.
 */
storage.returnCurrentDirectoryParentComment = function (dir) {
  const parentDir = path.join(dir, "../");
  if (!storage.exists(parentDir)) {
    return "";
  }

  /*Loads the comments from parentDir into array; returns what is found
   in the space indexed by the directory name.*/
  return `[Parent] ${
    storage.loadComments(parentDir)[getFileNameFromPath(dir)]
  }`;
};

/** Gets a single `.comment` file path from `.comments`.
 * @param {File} file a provided filename from the file tree.
 * @returns {string} parameter `file`'s equivalent `.comment` file.
 */
function getCommentsFile(file) {
  var dirname = path.dirname(file);
  var filename = getFileNameFromPath(file);

  return path.join(dirname, DIRECTORY, filename + EXTENSION);
}

/**From a valid filepath, returns the file the path refers to.
 * For example, `getFileName("path/to/thisFile")` returns `thisFile`.
 * @param {string} dir a valid filepath.
 * @returns {string} the filename the path refers to.
 */
function getFileNameFromPath(dir) {
  return path.basename(path.resolve(dir));
}
