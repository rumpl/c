# c

Write, view, edit and delete comments on files and directories.

Original idea by [Jonovono](https://github.com/Jonovono/c).

## Installation

Install the module globally with `npm install c -g`.

## Examples

Run it without any parameter to see the usage:

    list, l     [DIRECTORY]                 - Lists all the comments for the specified directory.
    set, s      [FILE|DIRECTORY] [COMMENT]  - Sets a new comment for the file/directory.
    remove, rm  [FILE|DIRECTORY]            - Deletes all the comments for the file/directory.

Author: Djordje Lukic <lukic.djordje@gmail.com>
Stolen from Jonovono (https://github.com/Jonovono/c)

List the comments

    $ c l .

    Comments for this directory:

      .npmignore
      bin

Set a comment to a folder/file

    $ c set bin This is the bin folder
    $ c list .

    Comments for this directory:

      .npmignore
      bin               This is the bin folder

Remove comments from a folder/file

    $ c rm bin
    $ c l .

    Comments for this directory:

      .npmignore
      bin

## License

MIT: http://rumpl.mit-license.org
