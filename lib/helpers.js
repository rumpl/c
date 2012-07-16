/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

'use strict';

// Dependencies
var _ = require('underscore');

var helpers = module.exports;

var print = function (node, nodeComment, maxLine) {
  nodeComment = nodeComment || '';

  var comments = nodeComment.split(/(\r\n|\n|\r)/gm);
  var pad = '';
  var completePad = '';

  _.times(maxLine - node.length + 6, function () { pad += ' '; });
  _.times(maxLine + 6, function () { completePad += ' '; });

  console.log('  ' + node.green + pad + comments[0].replace(/(\r\n|\n|\r)/gm, ''));

  // Remove the first since we already printed it.
  comments.splice(0, 1);

  // Other comments go in the next line, hence the 'completePad'.
  _.each(comments, function (comment) {
    var c = comment.replace(/(\r\n|\n|\r)/gm, '');
    if (c !== '') {
      console.log('  ' + completePad + c);
    }
  });
};

helpers.printFileComments = function (files, comments) {
  var maxLine = _.max(files, function (el) { return el.length; }).length;

  console.log('Comments for this directory:'.green + '\n');

  files.forEach(function (el, idx) {
    print(el, comments[el], maxLine);
  });

  console.log();
};
