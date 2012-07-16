/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

'use strict';

// Dependencies
var colors = require('colors');
var path = require('path');
var _ = require('underscore');

var helpers = require('./helpers');
var storage = require('./storage');

var commands = module.exports;

commands.list = function (root) {
  if (!storage.exists(root)) {
    storage.create(root);
  }

  var comments = storage.loadComments(root);
  var files = storage.list(root);

  helpers.printFileComments(files, comments);
};

commands.addComment = function (folder, comment) {
  storage.add(folder, comment);
};

commands.setComment = function (folder, comment) {
  storage.set(folder, comment);
};

commands.removeComments = function (folder) {
  storage.deleteComments(folder);
};

var ensureComments = function (cb) {
  return function () {
    var folder = arguments[0];

    if (!storage.exists(path.dirname(folder))) {
      storage.create(path.dirname(folder));
    }

    cb.apply(this, arguments);
  };
};

commands.add = ensureComments(commands.addComment);
commands.set = ensureComments(commands.setComment);
commands.remove = ensureComments(commands.removeComments);
