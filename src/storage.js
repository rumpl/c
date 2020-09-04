/**This file contains functions related to checking for, adding
 * and deleting .comment` files and `.comments` directories.*/

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

/**Sets a `.comment` file for a specific file.
 * @param {string} absolutePathToTarget the absolute path from the
 * working directory to the target node.
 * @param {string} comment The comment to be written.
 * @returns {number} exit code.
 */
storage.setCommentFile = function (absolutePathToTarget, comment) {
  //Check if `.comments` exists, makes it if not.
  if (!storage.commentsFolderExists(path.dirname(absolutePathToTarget))) {
    createCommentsFolder(path.dirname(absolutePathToTarget));
  }

  const fileObject = fs.openSync(
    getCommentsFile(absolutePathToTarget),
    "a",
    "0644"
  );

  fs.writeSync(fileObject, comment + "\n", null, "utf8");
  fs.closeSync(fileObject);

  return 0;
};

/**Deletes a `.comment` file, and deletes `.comments` if it is left empty.
 * @param {string} absolutePathToTarget An absolute path to the
 * target directory.
 * @returns {number} exit code.
 */
storage.delete = function (absolutePathToTarget) {
  if (!storage.commentsFolderExists(path.dirname(absolutePathToTarget))) {
    return 1;
  }

  const commentsFile = getCommentsFile(absolutePathToTarget);

  //If the `file.comment` does not exist...
  if (!fs.existsSync(commentsFile)) {
    return 1;
  }

  fs.unlinkSync(commentsFile);

  //If the `.comments` directory is now empty...
  if (
    storage.loadFiles(path.join(path.dirname(absolutePathToTarget), DIRECTORY))
      .length == 0
  ) {
    fs.rmdirSync(path.join(path.dirname(absolutePathToTarget), DIRECTORY));
  }

  return 0;
};

/**Checks if `.comments` exists.
 * @param {string} absolutePathToTargetParent the path to
 * the parent of the target.
 * @returns {boolean} true if `.comments` is present in the directory.
 * */
storage.commentsFolderExists = function (absolutePathToTargetParent) {
  return (
    fs.existsSync(path.join(absolutePathToTargetParent, DIRECTORY)) &&
    fs.statSync(absolutePathToTargetParent).isDirectory()
  );
};

/**Loads the names of all files & directories in the
 *  current directory, EXCEPT `.comments` folder.
 * @param {string} filePath a valid file path. May
 * be either relative or absolute.
 * @returns An array of filenames.
 */
storage.loadFiles = function (filePath) {
  return fs.readdirSync(filePath).filter((file) => {
    return file !== DIRECTORY;
  });
};

/**Loads the comments of all files & directories in the current directory.
 * @param {string} filePath a valid file path. May
 * be either relative or absolute.
 * @returns {array} A string array of comments.
 */
storage.loadComments = function (filePath) {
  let comments = [];
  const commentDir = fs.readdirSync(path.join(filePath, DIRECTORY));

  commentDir.forEach(function (file) {
    comments[path.basename(file, EXTENSION)] = fs
      .readFileSync(path.join(filePath, DIRECTORY, file))
      .toString();
  });

  return comments;
};

/**Fetches the comment associated with the current
directory from it's parent directory.
 * @param {string} filePath a valid file path. May 
 be either relative or absolute.
 * @returns {string} The comment associated with the directory.
 */
storage.returnCurrentDirectoryParentComment = function (filePath) {
  const parentDir = path.join(filePath, "../");

  if (!storage.commentsFolderExists(parentDir)) {
    return "";
  }

  /*Loads the comments from parentDir into array; returns what is found
   in the space indexed by the directory name.*/
  const comment = storage.loadComments(parentDir)[
    getFileNameFromPath(filePath)
  ];

  if (comment) {
    return `[Parent] ${comment}`;
  }

  return "";
};

/**Fetches the comment associated with the current
directory from it's parent directory.
 * @param {string} relativePathToTarget the relative path from the 
 * current directory to the target directory.
 * @returns {string} The comment associated with the directory.
 */
storage.returnCurrentDirectoryGrandparentComment = function (
  relativePathToTarget
) {
  const grandparentDir = path.join(relativePathToTarget, "../../");

  if (!storage.commentsFolderExists(grandparentDir)) {
    return "";
  }

  /*Loads the comments from grandparentDir into array; returns what is found
   in the space indexed by the directory name.*/
  const comment = storage.loadComments(grandparentDir)[
    getFileNameFromPath(path.join(relativePathToTarget, "../"))
  ];

  if (comment) {
    return `[Grandparent] ${comment}`;
  }

  return "";
};

/**Finds out if the provided path is valid.
 * @param {string} relativePathToTarget Relative file path.
 * @returns {boolean} if the path exists.
 */
storage.ifPathIsValid = function (relativePathToTarget) {
  return fs.existsSync(relativePathToTarget);
};

/**Finds out if the provided path is valid & not a file.
 * @param {string} relativePathToTarget Relative file path.
 * @returns {boolean} if the path exists & is not a file.
 */
storage.ifPathIsValidAndNotFile = function (relativePathToTarget) {
  return (
    fs.existsSync(relativePathToTarget) &&
    !fs.statSync(relativePathToTarget).isFile()
  );
};

/**Creates a `.comments` directory.
 * @param {string} absolutePathToParent a relative directory from the
 * working directory to the target files directory.
 * @returns {number} exit code.
 */
function createCommentsFolder(absolutePathToParent) {
  fs.mkdirSync(path.join(absolutePathToParent, DIRECTORY), "0755");
  return 0;
}

/**Gets a single `.comment` file path from `.comments`.
 * @param {string} absolutePathToTarget a provided filename from the file tree.
 * @returns {string} parameter `file`'s equivalent `.comment` file.
 */
function getCommentsFile(absolutePathToTarget) {
  console.log(absolutePathToTarget);
  const dirname = path.dirname(absolutePathToTarget);
  const filename = getFileNameFromPath(absolutePathToTarget);

  return path.join(dirname, DIRECTORY, filename + EXTENSION);
}

/**From a valid filepath, returns the file the path refers to.
 * For example, `getFileName("path/to/thisFile")` returns `thisFile`.
 * @param {string} filePath a valid filepath, may be
 * either relative or absolute.
 * @returns {string} the filename the path refers to.
 */
function getFileNameFromPath(filePath) {
  return path.basename(path.resolve(filePath));
}
