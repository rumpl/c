// @ts-nocheck
/* Capturing console logs, see 
https://glebbahmutov.com/blog/capture-all-the-logs/ */

const helpers = require("../src/helpers");
const storage = require("../src/storage");
const rewire = require("rewire");
const assert = require("assert");
const fs = require("fs");
const util = require("util");
const { stripColors } = require("colors/safe");

const app = rewire("../src/helpers.js");
const findMaxLengthOfArrayMember = app.__get__("findMaxLengthOfArrayMember");
const print = app.__get__("print");

global.method = { log: console.log };
let messages = [];

// ! Test helpers

// Captures console logs - allows for testing of what is output to the terminal
overwriteConsoleLog = () => {
  console.log = function () {
    const params = Array.prototype.slice.call(arguments, 1);
    const message = params.length
      ? util.format(arguments[0], ...params)
      : arguments[0];

    // Strips colour coding from members
    messages.push(stripColors(message));
  };
};

// Reinstates console log - data is no longer captured
reinstateConsoleLog = () => {
  console.log = global.method.log;
};

// Automatically checks if a directory doesn't exist, and creates it if not.
autoMkdirSync = (path, readMode) => {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path, readMode);
  }
};

// Automatically checks if a file doesn't exist, and creates it if not.
autoOpenSync = (path, readMode) => {
  if (!fs.existsSync(path)) {
    let file = fs.openSync(path, readMode);
    fs.closeSync(file);
  }
};

// Automatically checks if a directory exists, and deletes it if so
autoUnlinkSync = (path) => {
  if (fs.existsSync(path) && !fs.statSync(path).isDirectory()) {
    fs.unlinkSync(path);
  }
};

// Automatically checks if a file exists, and deletes it if so
autoRmdirSync = (path) => {
  if (fs.existsSync(path) && fs.statSync(path).isDirectory()) {
    fs.rmdirSync(path);
  }
};

// ! Test setup

// Performed before each test
beforeEach(() => {
  // Reset messages
  messages = [];

  // If pathTesting/ does not exist, make it exist
  autoMkdirSync("./test/pathTesting/", "0755");
  // If pathTesting/nested does not exist, make it exist
  autoMkdirSync("./test/pathTesting/nested/", "0755");
  // If pathTesting/nested/doubleNest does not exist, make it exist
  autoMkdirSync("./test/pathTesting/nested/doubleNest/", "0755");

  // If test1.txt does not exist, make it exist
  autoOpenSync("./test/pathTesting/test1.txt", "a");
  // If test2.txt does not exist, make it exist
  autoOpenSync("./test/pathTesting/test2.txt", "a");
  // If deleteTest.txt does not exist, make it exist
  autoOpenSync("./test/pathTesting/deleteTest.txt", "a");

  // delete test1.txt.comment
  autoUnlinkSync("./test/pathTesting/.comments/test1.txt.comment");
  // delete test2.txt.comment
  autoUnlinkSync("./test/pathTesting/.comments/test2.txt.comment");
  // delete .comments (file)
  autoUnlinkSync("./test/pathTesting/.comments");
  // delete nested.comment
  autoUnlinkSync("./test/pathTesting/.comments/nested.comment");

  // If .comments/ exists, delete it
  autoRmdirSync("./test/pathTesting/.comments/");
});

// ! Tests

// print()
describe("Tests `print()`:", () => {
  it("Prints a file with correct syntax, spacing and comment", () => {
    overwriteConsoleLog();
    print("test1.txt", "demo 1", 11, "./test/pathTesting");
    reinstateConsoleLog();

    assert.strictEqual(
      messages[0],
      `test1.txt    demo 1`,
      `${messages[0]} is not equal to ${`test1.txt    demo 1`}`
    );
  });

  it("Prints a directory with correct syntax, spacing and comment", () => {
    overwriteConsoleLog();
    print("nested", "dir demo", 11, "./test/pathTesting");
    reinstateConsoleLog();

    assert.strictEqual(
      messages[0],
      `nested/      dir demo`,
      `${messages[0]} is not equal to ${`nested/      dir demo`}`
    );
  });

  it("Prints a file with correct syntax, spacing and no comment", () => {
    overwriteConsoleLog();
    print("test1.txt", "", 11, "./test/pathTesting");
    reinstateConsoleLog();

    assert.strictEqual(
      messages[0],
      `test1.txt    `,
      `${messages[0]} is not equal to ${`test1.txt    `}`
    );
  });

  it("Prints a directory with correct syntax, spacing and no comment", () => {
    overwriteConsoleLog();
    print("nested", "", 11, "./test/pathTesting");
    reinstateConsoleLog();

    assert.strictEqual(
      messages[0],
      `nested/      `,
      `${messages[0]} is not equal to ${`nested/      `}`
    );
  });
});

// unfiltered printAllComments()
describe("Tests `printAllComments()` with unfiltered output:", () => {
  it("Every line contains the correct filename", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo 1");
    storage.setCommentFile("./test/pathTesting/test2.txt", "demo 2");
    storage.setCommentFile("./test/pathTesting/nested", "demo nested");

    // Gets the fileNames array, adds in current and parent directories
    const fileNames = storage.loadFiles("./test/pathTesting");
    fileNames.unshift("..");
    fileNames.unshift(".");

    // Gets the comments object
    let comments = storage.loadComments("./test/pathTesting");

    overwriteConsoleLog();
    helpers.printAllComments(fileNames, comments, "./test/pathTesting", false);
    reinstateConsoleLog();

    for (let i = 0; i < fileNames.length; i++) {
      let slash = "";
      if (fs.statSync(`./test/pathTesting/${fileNames[i]}`).isDirectory()) {
        slash = "/";
      }

      assert.strictEqual(
        messages[i].includes(fileNames[i] + slash),
        true,
        `${messages[i]} does not contain ${fileNames[i] + slash}`
      );
    }
  });

  it("Every line contains the correct amount of spaces", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo 1");
    storage.setCommentFile("./test/pathTesting/test2.txt", "demo 2");
    storage.setCommentFile("./test/pathTesting/nested", "demo nested");

    // Gets the fileNames array, adds in current and parent directories
    const fileNames = storage.loadFiles("./test/pathTesting");
    fileNames.unshift("..");
    fileNames.unshift(".");

    // Gets the comments object
    let comments = storage.loadComments("./test/pathTesting");

    overwriteConsoleLog();
    helpers.printAllComments(fileNames, comments, "./test/pathTesting", false);
    reinstateConsoleLog();

    const maxLineLength = findMaxLengthOfArrayMember(fileNames);

    for (let i = 0; i < fileNames.length; i++) {
      let extraSpace = 2;
      if (fs.statSync(`./test/pathTesting/${fileNames[i]}`).isDirectory()) {
        extraSpace = 1;
      }

      assert.strictEqual(
        messages[i].includes(
          " ".repeat(maxLineLength - fileNames[i].length + extraSpace)
        ),
        true,
        `${messages[i]} does not have ${
          maxLineLength - fileNames[i].length + extraSpace
        } amount of spacing.`
      );
    }
  });

  it("Every line contains the correct comment", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo 1");
    storage.setCommentFile("./test/pathTesting/test2.txt", "demo 2");
    storage.setCommentFile("./test/pathTesting/nested", "demo nested");

    // Gets the fileNames array, adds in current and parent directories
    const fileNames = storage.loadFiles("./test/pathTesting");
    fileNames.unshift("..");
    fileNames.unshift(".");

    // Gets the comments object
    let comments = storage.loadComments("./test/pathTesting");

    overwriteConsoleLog();
    helpers.printAllComments(fileNames, comments, "./test/pathTesting", false);
    reinstateConsoleLog();

    for (let i = 0; i < fileNames.length; i++) {
      // Regex's out the new line characters
      if (comments[fileNames[i]]) {
        comments[fileNames[i]] = comments[fileNames[i]].replace(
          /\r?\n|\r/g,
          ""
        );
      }

      if (comments[fileNames[i]]) {
        assert.strictEqual(
          messages[i].includes(comments[fileNames[i]]),
          true,
          `${comments[fileNames[i]]} is not contained within ${messages[i]}.`
        );
      } else {
        assert.strictEqual(
          messages[i].includes(comments[fileNames[i]]),
          false,
          `${comments[fileNames[i]]} is contained within ${messages[i]}.`
        );
      }
    }
  });
});

// filtered printAllComments()
describe("Tests `printAllComments()` with filtered output:", () => {
  it("If a line does not have a comment, it is not printed", () => {
    // Set's 3 comments
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo 1");
    storage.setCommentFile("./test/pathTesting/test2.txt", "demo 2");
    storage.setCommentFile("./test/pathTesting/nested", "demo nested");

    // Gets the fileNames array, adds in current and parent directories
    const fileNames = storage.loadFiles("./test/pathTesting");
    fileNames.unshift("..");
    fileNames.unshift(".");

    // Gets the comments object
    let comments = storage.loadComments("./test/pathTesting");

    // Captures console logging
    overwriteConsoleLog();
    helpers.printAllComments(fileNames, comments, "./test/pathTesting", true);
    reinstateConsoleLog();

    let size = 0;

    // Loops through every element of comments to count it's entries
    for (let i = 0; i < fileNames.length; i++) {
      if (comments[fileNames[i]]) size++;
    }

    // Compares if the entries in messages is the
    // same as the entries in the comments object
    assert.strictEqual(
      messages.length,
      size,
      `Messages[] has ${messages.length - size} entries more than comments[]`
    );
  });
});

// maxLength()
describe("Tests `maxLength()`:", () => {
  it("Returns the int length of the longest filename in an array", () => {
    assert.strictEqual(
      // the return value of the function
      findMaxLengthOfArrayMember([
        "",
        "1",
        "four",
        "123456789",
        "incredibly massively long",
        "by far the longest string in this entire array",
      ]),
      // the length of the longest string
      "by far the longest string in this entire array".length,
      // error message
      `the method returned the value ${findMaxLengthOfArrayMember([
        "",
        "1",
        "four",
        "123456789",
        "incredibly massively long",
        "by far the longest string in this entire array",
      ])} not ${"by far the longest string in this entire array".length}`
    );
  });

  it("Returns 0 when given an empty array", () => {
    assert.strictEqual(
      findMaxLengthOfArrayMember([]),
      0,
      `The function returned ${findMaxLengthOfArrayMember([])}`
    );
  });

  it("When given a single string, returns the length of that string", () => {
    assert.strictEqual(
      findMaxLengthOfArrayMember(["five+four"]),
      "five+four".length,
      `The function returned ${findMaxLengthOfArrayMember(["five+four"])} not ${
        "five+four".length
      }`
    );
  });
});
