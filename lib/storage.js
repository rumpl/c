//!
//TODO handle file names with spaces in them

"use strict";

var fs = require("fs"); //FileSystem
var path = require("path");
var underscore = require("underscore");

var storage = module.exports;
var STORE = ".comments";
var POSTFIX = ".comment";

//Find out if a file-path exists
storage.exists = function (node) {
  var exists = fs.existsSync(path.join(node, STORE));

  if (!exists) {
    return false;
  }

  var stat = fs.statSync(node);

  return stat.isDirectory();
};

storage.create = function (node) {
  fs.mkdirSync(path.join(node, STORE), "0755");
};

storage.list = function (root) {
  return underscore.filter(fs.readdirSync(root), function (el) {
    return el !== STORE;
  });
};

//
storage.loadComments = function (node) {
  var ret = [];
  var files = fs.readdirSync(path.join(node, STORE));

  files.forEach(function (el, idx) {
    ret[path.basename(el, POSTFIX)] = fs
      .readFileSync(path.join(node, STORE, el))
      .toString();
  });

  return ret;
};

storage._getCommentsFile = function (node) {
  var dirname = path.dirname(node);
  var filename = path.basename(node);

  return path.join(dirname, STORE, filename + POSTFIX);
};

storage.set = function (node, comment) {
  if (!fs.existsSync(node)) {
    throw "Path " + node + " does not exist.";
  }

  var commentsFile = storage._getCommentsFile(node);

  fs.writeFileSync(commentsFile, comment + "\n");
};

storage.add = function (node, comment) {
  if (!fs.existsSync(node)) {
    throw "Path " + node + " does not exist.";
  }

  var commentsFile = storage._getCommentsFile(node);
  var id = fs.openSync(commentsFile, "a", "0644");

  fs.writeSync(id, comment + "\n", null, "utf8");

  fs.close(id);
};

storage.deleteComments = function (root) {
  var commentsFile = storage._getCommentsFile(root);

  fs.unlinkSync(commentsFile);
};
