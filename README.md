# c

Give folders or directories comments and view them easy.

Original idea by [Jonovono](https://github.com/Jonovono/c)

## Installation
Install the module with: `npm install c -g`

## Examples

Run it without any parameter to see the usage

    help:
    help:   c - Add comments to any file or directory.
    help:
    help:   Usage:
    help:
    help:        c list   [DIRECTORY]                 - Lists all the comments for the [DIRECTORY].
    help:        c add    [FILE|DIRECTORY] [COMMENT]  - Adds a comment for the file/directory.
    help:        c set    [FILE|DIRECTORY] [COMMENT]  - Sets a new comment for the file/directory.
    help:        c delete [FILE|DIRECTORY]            - Deletes all the comments for the file/directory.
    help:
    help:   Author: Djordje Lukic <lukic.djordje@gmail.com>
    help:   Stolen from Jonovono (https://github.com/Jonovono/c)


List the comments

    $ c l .

    Comments for this directory:

      .npmignore
      bin

Add a comment to a folder/file

    $ c add bin This is the bin folder
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

## TODO

Tests tests tests

## License

MIT: http://rumpl.mit-license.org
