//!Declares a flatiron app and it's "usage" parameter.

"use strict";

var flatiron = require("flatiron");

var app = (module.exports = flatiron.app);

app.use(flatiron.plugins.cli, {
  usage: [
    "list, l     [DIRECTORY]                 - Lists all the comments for the specified directory.",
    "set, s      [FILE|DIRECTORY] [COMMENT]  - Sets a new comment for the file/directory.",
    "remove, rm  [FILE|DIRECTORY]            - Deletes all the comments for the file/directory.",
  ],
});
