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

const storage = module.exports;

//Constants representing the directory name & file extension, respectively.
const DIRECTORY = ".comments";
const EXTENSION = ".comment";

/** Sets a `.comment` file for a specific file.
 * @param {string} relativePathToTargetNode the relative path from the
 * working directory to the target node.
 * @param {String} comment The comment to be written.
 * @returns {int} exit code.
 */
storage.setCommentFile = function (relativePathToTargetNode, comment) {
  //Check if `.comments` exists, makes it if not.
  if (!storage.commentsFolderExists(path.dirname(relativePathToTargetNode))) {
    createCommentsFolder(path.dirname(relativePathToTargetNode));
  }

  const fileObject = fs.openSync(
    getCommentsFile(relativePathToTargetNode),
    "a",
    "0644"
  );

  fs.writeSync(fileObject, comment + "\n", null, "utf8");
  fs.closeSync(fileObject);

  return 0;
};

/**Deletes a `.comment` file, and deletes `.comments` if it is left empty.
 * @param {File} file The name of the file whose `.comment` needs to be deleted
 * @returns {int} exit code.
 */
storage.delete = function (file) {
  //If there is no `.comments` directory...
  if (!storage.commentsFolderExists(path.dirname(file))) {
    return 1;
  }

  const commentsFile = getCommentsFile(file);

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
storage.commentsFolderExists = function (dir) {
  return (
    fs.existsSync(path.join(dir, DIRECTORY)) && fs.statSync(dir).isDirectory()
  );
};

/** Loads the names of all files & directories in the
 *  current directory, EXCEPT `.comments` folder.
 * @param {File} dir a provided directory from the file tree.
 * @returns An array of filenames.
 */
storage.loadFiles = function (dir) {
  return fs.readdirSync(dir).filter((file) => {
    return file !== DIRECTORY;
  });
};

/** Loads the comments of all files & directories in the current directory.
 * @param {string} dir the relative path from the working
 * directory to the target.
 * @returns {array} A string array of comments.
 */
storage.loadComments = function (dir) {
  let comments = [];
  const commentDir = fs.readdirSync(path.join(dir, DIRECTORY));

  commentDir.forEach(function (file) {
    comments[path.basename(file, EXTENSION)] = fs
      .readFileSync(path.join(dir, DIRECTORY, file))
      .toString();
  });

  return comments;
};

//TODO: as below, for ../ directory?

/** Fetches the comment associated with the current
directory from it's parent directory.
 * @param {string} dir the relative path from the current directory
 * to the target directory.
 * @returns {string} The comment associated with the directory.
 */
storage.returnCurrentDirectoryParentComment = function (dir) {
  const parentDir = path.join(dir, "../");

  if (!storage.commentsFolderExists(parentDir)) {
    return "";
  }

  /*Loads the comments from parentDir into array; returns what is found
   in the space indexed by the directory name.*/
  const comment = storage.loadComments(parentDir)[getFileNameFromPath(dir)];

  if (comment) {
    return `[Parent] ${comment}`;
  }

  return "";
};

/** Finds out if the provided path is valid.
 * @param {string} path Relative file path.
 * @returns {Boolean} if the path exists.
 */
storage.ifPathIsValid = function (path) {
  return fs.existsSync(path);
};

/** Finds out if the provided path is valid & not a file.
 * @param {string} path Relative file path.
 * @returns {Boolean} if the path exists & is not a file.
 */
storage.ifPathIsValidAndNotFile = function (path) {
  return fs.existsSync(path) && !fs.statSync(path).isFile();
};

/**Creates a `.comments` directory.
 * @param {File} dir a relative directory from the
 * working directory to the target files directory.
 * @returns {int} exit code.
 */
function createCommentsFolder(dir) {
  fs.mkdirSync(path.join(dir, DIRECTORY), "0755");
  return 0;
}

/** Gets a single `.comment` file path from `.comments`.
 * @param {File} file a provided filename from the file tree.
 * @returns {string} parameter `file`'s equivalent `.comment` file.
 */
function getCommentsFile(file) {
  const dirname = path.dirname(file);
  const filename = getFileNameFromPathIgnoreRootOrParent(file);

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

/**From a valid filepath, returns the file the path refers to.
 * For example, `getFileName("path/to/thisFile")` returns `thisFile`.
 * If the provided path is just `.` or `..`, return itself.
 * @param {string} dir a valid filepath.
 * @returns {string} the filename the path refers to.
 */
function getFileNameFromPathIgnoreRootOrParent(dir) {
  if (dir == "." || dir == "./" || dir == ".." || dir == "../") {
    return dir;
  }

  return path.basename(path.resolve(dir));
}
