/* For testing no exported functions, see https://bit.ly/3jSFQ8s */
/* Capturing console logs, see https://glebbahmutov.com/blog/capture-all-the-logs/ */
/* Writing tests, see 
https://codeburst.io/how-to-test-javascript-with-mocha-the-basics-80132324752e */

const storage = require("../src/storage");
const rewire = require("rewire");
const assert = require("assert");
const fs = require("fs");
const path = require("path");

const app = rewire("../src/storage.js");
const createCommentsFolder = app.__get__("createCommentsFolder");

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

  if (fs.existsSync("./test/pathTesting/.comments/test2.txt.comment")) {
    fs.unlinkSync("./test/pathTesting/.comments/test2.txt.comment");
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

//after
afterEach(() => {});

//!TESTS
//createCommentsFolder()
describe("Tests `createCommentsFolder()`: ", () => {
  it("Creates a `.comments` folder in `./test/pathTesting/`", () => {
    assert.equal(createCommentsFolder("./test/pathTesting/"), 0);
    assert.equal(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/.comments/"),
      true
    );
  });
});

//setCommentsFile()
describe("Tests `setCommentFile()`: ", () => {
  it("Set's a `.comment` file where `.comments` doesn't exists", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo");

    assert.equal(
      fs.existsSync("./test/pathTesting/.comments/test1.txt.comment"),
      true
    );
  });

  it("Set's a `.comment` file where `.comments` does exists", () => {
    assert.equal(createCommentsFolder("./test/pathTesting"), 0);

    assert.equal(
      storage.setCommentFile("./test/pathTesting/test2.txt", "demo"),
      0
    );

    assert.equal(
      fs.existsSync("./test/pathTesting/.comments/test2.txt.comment"),
      true
    );
  });

  it("Set's a `.comment` file for `./` in `./`'s parent", () => {
    storage.setCommentFile("./test/pathTesting/nested", "demo");

    assert.equal(
      fs.existsSync("./test/pathTesting/.comments/nested.comment"),
      true
    );
  });

  //Failing!
  it("Set's a `.comment` file for `../` in `./`'s grandparent", () => {
    storage.setCommentFile(
      path.resolve("./test/pathTesting/nested/doubleNest/../"),
      "demo"
    );

    assert.equal(
      fs.existsSync("./test/pathTesting/.comments/nested.comment"),
      true
    );
  });

  it("Writes the correct value into a `.comment` file", () => {
    //TODO: write this test
    assert.equal(1, 2);
  });
});

//deleteSingleCommentFile()
describe("Tests `deleteSingleCommentFile()`: ", () => {
  it("Deletes a `.comment` and keeps it's `.comments`", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo");
    storage.setCommentFile("./test/pathTesting/test2.txt", "demo");
    assert.equal(
      storage.deleteSingleCommentFile("./test/pathTesting/test1.txt"),
      0
    );

    assert.equal(
      fs.existsSync("./test/pathTesting/.comments/test1.txt.comment"),
      false
    );

    assert.equal(fs.existsSync("./test/pathTesting/.comments"), true);
  });

  it("Deletes a `.comment` and removes it's `.comments`", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo");
    assert.equal(
      storage.deleteSingleCommentFile("./test/pathTesting/test1.txt"),
      0
    );

    assert.equal(
      fs.existsSync("./test/pathTesting/.comments/test1.txt.comment"),
      false
    );

    assert.equal(fs.existsSync("./test/pathTesting/.comments"), false);
  });

  it("Fails when given a valid file path with no corresponding `.comment`", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo");
    assert.equal(
      storage.deleteSingleCommentFile("./test/pathTesting/test2.txt"),
      1
    );
  });

  it("Fails when given a valid file path with no corresponding `.comments`", () => {
    assert.equal(
      storage.deleteSingleCommentFile("./test/pathTesting/test2.txt"),
      1
    );
  });

  it("Fails when given an invalid directory", () => {
    assert.equal(
      storage.deleteSingleCommentFile("./fakePath/fakerPath.fake"),
      1
    );
  });
});

//TODO: test commentsFolderExists()

//TODO: test loadFiles()

//TODO: test loadComments()

//TODO: test returnCurrentDirectoryParentComment()

//TODO: test returnCurrentDirectoryGrandparentComment()

//IfPathIsValid()
describe("Tests `ifPathIsValid()`: ", () => {
  it("returns false with an invalid path", () => {
    assert.equal(storage.ifPathIsValid("./fakePath/fakeFile.fake"), false);
  });

  it("returns true with a valid path", () => {
    assert.equal(storage.ifPathIsValidAndNotFile("./test/pathTesting/"), true);
  });
});

//ifPathIsValidAndNotFile()
describe("Tests `ifPathIsValidAndNotFile()`: ", () => {
  it("returns false with an invalid non-file path", () => {
    assert.equal(
      storage.ifPathIsValidAndNotFile("./fakePath/fakeFile.fake"),
      false
    );
  });

  it("returns false with an invalid file path", () => {
    assert.equal(
      storage.ifPathIsValidAndNotFile("./fakePath/fakerPath/"),
      false
    );
  });

  it("returns false with a valid file path", () => {
    assert.equal(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/test1.txt"),
      false
    );
  });

  it("returns true with a valid non-file path", () => {
    assert.equal(storage.ifPathIsValidAndNotFile("./test/pathTesting/"), true);
  });
});

//TODO: test getCommentsFilePath()

//TODO: test getFileNameFromPath()
