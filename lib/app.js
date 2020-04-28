//!Declares a flatiron app and it's "usage" parameter.

"use strict";

var meow = require("meow");
var colors = require("colors");
var commands = require("./commands");

var cli = meow(
  `
    Usage
      $ c <DIRECTORY|FILE>
 
    Options:
      --list,   -l   :  Lists all the comments for the specified directory.
      --set,    -s   :  Sets or overwrites a new comment for the file|directory.
      --remove, -rm  :  Deletes the comment for the file|directory.
 
    Examples
      $c -l .
      someDir           Some comment.
      noComment         
      AnyFile.extension Another comment.
      foo               That's all.

      $ c -l foo.bar
      foo.bar   Some comment
`,
  {
    flags: {
      list: {
        type: "boolean",
        alias: "l",
      },
      set: {
        type: "string",
        alias: "s",
      },
      remove: {
        type: "boolean",
        alias: "rm",
      },
    },
  }
);

c(cli.input[0], cli.flags);
