//!This file contains functions related to checking for, adding and deleting `.comment` files and `.comments` directories.

"use strict";

var fs = require("fs"); //FileSystem
var path = require("path"); //Paths
var underscore = require("underscore"); //Some functional shit

var storage = module.exports;
var DIRECTORY = ".comments";
var EXTENSION = ".comment";

/**Checks if `.comments` exists.
 * @param dir a provided directory from the file tree.
 * @returns true if `.comments` is present in the directory.
 * */
storage.exists = function (dir) {
  var exists = fs.existsSync(path.join(dir, DIRECTORY)); //Checks if the .comments directory exists

  //If it exists...
  if (exists) {
    return fs.statSync(dir).isDirectory(); //Returns if it's a directory
  }

  return false;
};

/**Creates a `.comments` directory.
 * @param dir a provided directory from the file tree.
 */
storage.create = function (dir) {
  fs.mkdirSync(path.join(dir, DIRECTORY), "0755"); //?Why option "0755?"
};

/** Loads the names of all files & directories in the current directory EXCEPT `.comments`
 * @param dir a provided directory from the file tree.
 * @returns An array of filenames.
 */
storage.loadFiles = function (dir) {
  return underscore.filter(fs.readdirSync(dir), function (file) {
    return file !== DIRECTORY;
  });
};

/** Loads the comments of all files & directories in the current directory.
 * @param dir a provided directory from the file tree.
 * @returns An array of comments.
 */
storage.loadComments = function (dir) {
  var comments = []; //Array used to store comments.
  var commentDir = fs.readdirSync(path.join(dir, DIRECTORY)); //The `.comments` directory

  //For each `.comment` in `.comments`, place it into the array.
  commentDir.forEach(function (file) {
    comments[path.basename(file, EXTENSION)] = fs
      .readFileSync(path.join(dir, DIRECTORY, file))
      .toString();
  });

  return comments;
};

/** Gets a single `.comment` file from `.comments`.
 * @param file a provided filename from the file tree.
 * @returns parameter `file`'s equivalent `.comment` file.
 */
function getCommentsFile(file) {
  var dirname = path.dirname(file); //Gets the name of the directory the file is from.
  var filename = path.basename(file); //Gets the files name.

  return path.join(dirname, DIRECTORY, filename + EXTENSION); //Returns the files relevant `.comment`.
}

/** Set's a `.comment` file for a specific file.
 * @param file a provided directory from the file tree.
 * @param comment The comment to be written.
 */
storage.set = function (file, comment) {
  //If the file does not exist, throw an error.
  if (!fs.existsSync(file)) {
    console.error(
      "Path `" + file + "` does not exist, please provide a valid path."
    );
    return;
  }

  var commentsFile = getCommentsFile(file); //Gets the file path
  fs.writeFileSync(commentsFile, comment); //Writes the .comment file.
};

/**Deletes a `.comment` file.
 * @param file The name of the file whose `.comment` needs to be deleted.
 */
storage.delete = function (file) {
  if (!fs.existsSync(file)) {
    console.error("Path `" + file + "` does not exist.");
    return;
  }

  var commentsFile = getCommentsFile(file); //Gets the file name.

  fs.unlinkSync(commentsFile); //Deletes the file name.
};

//TODO: Make a cleaner function that cleans out unused `.comment` files (if a file is no longer present, remove it's `.comment` file)
//TODO: Make a renaming function that allows you to simultaneously rename a file and it's relevant `.comment.`
