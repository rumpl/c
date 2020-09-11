// @ts-nocheck
/* Capturing console logs, see 
https://glebbahmutov.com/blog/capture-all-the-logs/ */

const helpers = require("../src/helpers");
const storage = require("../src/storage");
const rewire = require("rewire");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const util = require("util");
const { stripColors } = require("colors/safe");

const app = rewire("../src/helpers.js");
const maxLength = app.__get__("maxLength");
const print = app.__get__("print");

//Before
beforeEach(() => {
  //If pathTesting/ does not exist, make it exist
  if (!fs.existsSync("./test/pathTesting/")) {
    fs.mkdirSync("./test/pathTesting/", "0755");
  }

  //If pathTesting/nested does not exist, make it exist
  if (!fs.existsSync("./test/pathTesting/nested/")) {
    fs.mkdirSync("./test/pathTesting/nested", "0755");
  }

  //If pathTesting/nested/doubleNest does not exist, make it exist
  if (!fs.existsSync("./test/pathTesting/nested/doubleNest/")) {
    fs.mkdirSync("./test/pathTesting/nested/doubleNest/", "0755");
  }

  //If test1.txt does not exist, make it exist
  if (!fs.existsSync("./test/pathTesting/test1.txt")) {
    let file = fs.openSync("./test/pathTesting/test1.txt", "a");
    fs.closeSync(file);
  }

  //If test2.txt does not exist, make it exist
  if (!fs.existsSync("./test/pathTesting/test2.txt")) {
    let file = fs.openSync("./test/pathTesting/test2.txt", "a");
    fs.closeSync(file);
  }

  //If deleteTest.txt does not exist, make it exist
  if (!fs.existsSync("./test/pathTesting/deleteTest.txt")) {
    let file = fs.openSync("./test/pathTesting/deleteTest.txt", "a");
    fs.closeSync(file);
  }

  //!If .comments/ is populated, delete it's children
  //test1.txt.comment
  if (fs.existsSync("./test/pathTesting/.comments/test1.txt.comment")) {
    fs.unlinkSync("./test/pathTesting/.comments/test1.txt.comment");
  }

  //test2.txt.comment
  if (fs.existsSync("./test/pathTesting/.comments/test2.txt.comment")) {
    fs.unlinkSync("./test/pathTesting/.comments/test2.txt.comment");
  }

  //.comments (file)
  if (
    fs.existsSync("./test/pathTesting/.comments") &&
    !fs.statSync("./test/pathTesting/.comments").isDirectory()
  ) {
    fs.unlinkSync("./test/pathTesting/.comments");
  }

  //nested.comment
  if (fs.existsSync("./test/pathTesting/.comments/nested.comment")) {
    fs.unlinkSync("./test/pathTesting/.comments/nested.comment");
  }

  //If .comments/ exists, delete it
  if (fs.existsSync("./test/pathTesting/.comments/")) {
    fs.rmdirSync("./test/pathTesting/.comments/");
  }
});

//TODO: test print()

//printFileComments()
describe("Tests `printFileComments()`:", () => {
  it("Prints in the correct format", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo 1");
    storage.setCommentFile("./test/pathTesting/test2.txt", "demo 2");
    storage.setCommentFile("./test/pathTesting/nested", "demo nested");

    //Spoofs the fileNames array, adds in current and parent directories
    const fileNames = storage.loadFiles("./test/pathTesting");
    fileNames.unshift("..");
    fileNames.unshift(".");

    //spoof the comments object
    let comments = storage.loadComments("./test/pathTesting");

    //Regex's out \n from comments
    for (let i = 0; i < fileNames.length; i++) {
      if (comments[fileNames[i]]) {
        comments[fileNames[i]] = comments[fileNames[i]].replace(
          /\r?\n|\r/g,
          ""
        );
      }
    }

    //Save the original console.log
    let messages = [];
    global.method = {};
    global.method.log = console.log;

    //Capture all console logs in "messages"
    console.log = function () {
      const params = Array.prototype.slice.call(arguments, 1);
      const message = params.length
        ? util.format(arguments[0], ...params)
        : arguments[0];

      //Strips colour coding from members
      messages.push(stripColors(message));
    };

    //each line of console.log is pushed into "messages"
    helpers.printFileComments(fileNames, comments, "./test/pathTesting");

    //Console log is reinstated
    console.log = global.method.log;

    for (let i = 0; i < messages.length; i++) {
      let spaces = maxLength(fileNames) - fileNames[i].length;

      let backSlash = "  ";
      if (fs.statSync(`./test/pathTesting/${fileNames[i]}`).isDirectory()) {
        backSlash = "/ ";
      }

      let comment = "";
      if (comments[fileNames[i]]) {
        comment = comments[fileNames[i]];
      }

      let sentence = `${
        fileNames[i] + backSlash + " ".repeat(spaces) + comment
      }`;

      assert.strictEqual(messages[i].includes(sentence), true);
    }
  });
});

//TODO: test printOnlyComments()

//maxLength()
describe("Tests `maxLength()`:", () => {
  it("Returns the int length of the longest filename in an array", () => {
    assert.strictEqual(
      maxLength([
        "",
        "1",
        "four",
        "123456789",
        "incredibly massively long",
        "by far the longest string in this entire array",
      ]),
      "by far the longest string in this entire array".length
    );
  });

  it("Returns 0 when given an empty array", () => {
    assert.strictEqual(maxLength([]), 0);
  });

  it("When given a single string, returns the length of that string", () => {
    assert.strictEqual(maxLength(["five+four"]), "five+four".length);
  });
});
