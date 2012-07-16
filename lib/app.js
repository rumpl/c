/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

'use strict';

var flatiron = require('flatiron');

var app = module.exports = flatiron.app;

app.use(flatiron.plugins.cli, {
  usage: [
    '',
    'c - Add comments to any file or directory.',
    '',
    'Usage:',
    '',
    '     c list   [DIRECTORY]                 - Lists all the comments for the [DIRECTORY].',
    '     c add    [FILE|DIRECTORY] [COMMENT]  - Adds a comment for the file/directory.',
    '     c set    [FILE|DIRECTORY] [COMMENT]  - Sets a new comment for the file/directory.',
    '     c delete [FILE|DIRECTORY]            - Deletes all the comments for the file/directory.',
    '',
    'Author: Djordje Lukic <lukic.djordje@gmail.com>',
    'Stolen from Jonovono (https://github.com/Jonovono/c)'
  ]
});
