/* For testing no exported functions, see https://bit.ly/3jSFQ8s */
/* Capturing console logs, seehttps://glebbahmutov.com/blog/capture-all-the-logs/ */
/* Writing tests, see 
https://codeburst.io/how-to-test-javascript-with-mocha-the-basics-80132324752e */

const storage = require("../src/storage");
const rewire = require("rewire");
const assert = require("assert");
const fs = require("fs");

const app = rewire("../src/storage.js");
const createCommentsFolder = app.__get__("createCommentsFolder");

beforeEach(() => {
  //If pathTesting/ does not exist, make it exist
  if (!fs.existsSync("./test/pathTesting/")) {
    fs.mkdirSync("./test/pathTesting/", "0755");
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
});

afterEach(() => {
  //If .comments/ exists, delete it
  if (fs.existsSync("./test/pathTesting/.comments")) {
    fs.rmdirSync("./test/pathTesting/.comments");
  }
});

//TODO: test setCommentFile()

//TODO: test delete()

//TODO: test commentsFolderExists()

//TODO: test loadFiles()

//TODO: test loadComments()

//TODO: test returnCurrentDirectoryParentComment()

//TODO: test returnCurrentDirectoryGrandparentComment()

//IfPathIsValid()
describe("Tests `ifPathIsValid()`: ", () => {
  it("returns false with an invalid path.", () => {
    assert.equal(storage.ifPathIsValid("./fakePath/fakeFile.fake"), false);
  });

  it("returns true with a valid path.", () => {
    assert.equal(storage.ifPathIsValidAndNotFile("./test/pathTesting/"), true);
  });
});

//ifPathIsValidAndNotFile()
describe("Tests `ifPathIsValidAndNotFile()`: ", () => {
  it("returns false with an invalid non-file path.", () => {
    assert.equal(
      storage.ifPathIsValidAndNotFile("./fakePath/fakeFile.fake"),
      false
    );
  });

  it("returns false with an invalid file path.", () => {
    assert.equal(
      storage.ifPathIsValidAndNotFile("./fakePath/fakerPath/"),
      false
    );
  });

  it("returns false with a valid file path.", () => {
    assert.equal(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/test1.txt"),
      false
    );
  });

  it("returns true with a valid non-file path.", () => {
    assert.equal(storage.ifPathIsValidAndNotFile("./test/pathTesting/"), true);
  });
});

//createCommentsFolder()
describe("Tests `createCommentsFolder()`: ", () => {
  it("Creates a `.comments` folder in `./test/pathTesting/`.", () => {
    assert.equal(createCommentsFolder("./test/pathTesting/"), 0);
    assert.equal(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/.comments/"),
      true
    );
  });
});

//TODO: test createCommentsFolder()

//TODO: test getCommentsFilePath()

//TODO: test getFileNameFromPath()
