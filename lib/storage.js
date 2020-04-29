//!This file contains functions related to checking for, adding and deleting `.comment` files and `.comments` directories.

/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

"use strict";

var fs = require("fs"); //FileSystem
var path = require("path"); //Paths
var underscore = require("underscore"); //Some functional shit
var storage = module.exports;
var DIRECTORY = ".comments";
var EXTENSION = ".comment";

/** Sets a `.comment` file for a specific file.
 * @param {File} file a provided directory from the file tree.
 * @param {String} comment The comment to be written.
 */
storage.set = function (file, comment) {
  //Check if `.comments` exists, makes it if not.
  if (!storage.exists(path.dirname(file))) {
    storage.create(path.dirname(file));
  }

  var commentsFile = getCommentsFile(file); //Gets the file path
  fs.writeFileSync(commentsFile, comment); //Writes the .comment file.
  console.log(file + ".comment was written successfully.");
};

/**Deletes a `.comment` file, and deletes `.comments` if it is left empty.
 * @param {File} file The name of the file whose `.comment` needs to be deleted.
 */
storage.delete = function (file) {
  //If there is no `.comments` directory...
  if (!storage.exists(path.dirname(file))) {
    console.log(`No comment to be deleted for "${file}"`);
    return;
  }

  var commentsFile = getCommentsFile(file);

  //If the `file.comment` does not exist...
  if (!fs.existsSync(commentsFile)) {
    console.log(`No comment to be deleted for "${file}"`);
    return;
  }

  fs.unlinkSync(commentsFile);
  console.log(file + ".comment was deleted successfully.");

  //If the `.comments` directory is now empty...
  if (storage.loadFiles(path.join(path.dirname(file), DIRECTORY)).length == 0) {
    fs.rmdirSync(path.join(path.dirname(file), DIRECTORY));
  }
};

/**Checks if `.comments` exists.
 * @param {File} dir a provided directory from the file tree.
 * @returns true if `.comments` is present in the directory.
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
  fs.mkdirSync(path.join(dir, DIRECTORY), "0755"); //?Why option "0755?"
};

/** Loads the names of all files & directories in the current directory EXCEPT `.comments`
 * @param {File} dir a provided directory from the file tree.
 * @returns An array of filenames.
 */
storage.loadFiles = function (dir) {
  return underscore.filter(fs.readdirSync(dir), function (file) {
    return file !== DIRECTORY;
  });
};

/** Loads the comments of all files & directories in the current directory.
 * @param {File} dir a provided directory from the file tree.
 * @returns An array of comments.
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

/** Gets a single `.comment` file from `.comments`.
 * @param {File} file a provided filename from the file tree.
 * @returns parameter `file`'s equivalent `.comment` file.
 */
function getCommentsFile(file) {
  var dirname = path.dirname(file);
  var filename = path.basename(file);

  return path.join(dirname, DIRECTORY, filename + EXTENSION);
}

//TODO: Make a cleaner function that cleans out unused `.comment` files (if a file is no longer present, remove it's `.comment` file)
