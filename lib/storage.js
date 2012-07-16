/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

'use strict';

var fs = require('fs');
var path = require('path');
var _ = require('underscore');

var storage = module.exports;

storage.STORE = '.comments';
storage.POSTFIX = '.comment';

storage.exists = function (node) {
  var exists = fs.existsSync(path.join(node, storage.STORE));

  if (!exists) {
    return false;
  }

  var stat = fs.statSync(node);

  return stat.isDirectory();
};

storage.create = function (node) {
  fs.mkdirSync(path.join(node, storage.STORE), '0755');
};

storage.list = function (root) {
  return _.filter(fs.readdirSync(root), function (el) { return el !== storage.STORE; });
};

storage.loadComments = function (node) {
  var ret = [];
  var files = fs.readdirSync(path.join(node, storage.STORE));

  files.forEach(function (el, idx) {
    ret[path.basename(el, storage.POSTFIX)] = fs.readFileSync(path.join(node, storage.STORE, el)).toString();
  });

  return ret;
};

storage._getCommentsFile = function (node) {
  var dirname = path.dirname(node);
  var filename = path.basename(node);

  return path.join(dirname, storage.STORE, filename + storage.POSTFIX);
};

storage.set = function (node, comment) {
  if (!fs.existsSync(node)) {
    throw 'Path ' + node + ' does not exist.';
  }

  var commentsFile = storage._getCommentsFile(node);

  fs.writeFileSync(commentsFile, comment + '\n');
};

storage.add = function (node, comment) {
  if (!fs.existsSync(node)) {
    throw 'Path ' + node + ' does not exist.';
  }

  var commentsFile = storage._getCommentsFile(node);
  var id = fs.openSync(commentsFile, 'a', '0644');

  fs.writeSync(id, comment + '\n', null, 'utf8');

  fs.close(id);
};

storage.deleteComments = function (root) {
  var commentsFile = storage._getCommentsFile(root);

  fs.unlinkSync(commentsFile);
};
