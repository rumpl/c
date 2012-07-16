/*
 * c
 * https://github.com/rumpl/c
 *
 * Copyright (c) 2012 Djordje Lukic
 * Licensed under the MIT license.
 */

'use strict';

var app = module.exports = require('./app');
var colors = require('colors');
var commands = require('./commands');

// Lists all the comments in the directory
app.cmd(/list (.+)/, commands.list);
app.cmd(/l (.+)/, commands.list);

// Sets a new comment to a file/directory, will erase all older comments
app.cmd(/set :folder (.+)/, commands.set);
app.cmd(/s :folder (.+)/, commands.set);

// Adds a comment to a file/directory
app.cmd(/add :folder (.+)/, commands.add);
app.cmd(/a :folder (.+)/, commands.add);

// Deletes all the comments of a file/directory
app.cmd(/remove (.+)/, commands.remove);
app.cmd(/rm (.+)/, commands.remove);
app.cmd(/r (.+)/, commands.remove);
