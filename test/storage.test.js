// @ts-nocheck
/* Capturing console logs, see https://glebbahmutov.com/blog/capture-all-the-logs/ */

const storage = require("../src/storage");
const rewire = require("rewire");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;

const app = rewire("../src/storage.js");
const createCommentsFolder = app.__get__("createCommentsFolder");
const getCommentsFilePath = app.__get__("getCommentsFilePath");
const getFileNameFromPath = app.__get__("getFileNameFromPath");

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

//after
afterEach(() => {});

//!TESTS
//createCommentsFolder()
describe("Tests `createCommentsFolder()`: ", () => {
  it("Creates a `.comments` folder in `./test/pathTesting/`", () => {
    assert.strictEqual(createCommentsFolder("./test/pathTesting/"), 0);
    assert.strictEqual(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/.comments/"),
      true,
      `${storage.ifPathIsValidAndNotFile(
        "./test/pathTesting/.comments/"
      )} returns 'false.'`
    );
  });
});

//setCommentsFile()
describe("Tests `setCommentFile()`: ", () => {
  it("Set's a `.comment` file where `.comments` doesn't exists", () => {
    assert.strictEqual(
      storage.setCommentFile("./test/pathTesting/test1.txt", "demo"),
      0,
      `${storage.setCommentFile("./test/pathTesting/test1.txt", "demo")} fails`
    );

    assert.strictEqual(
      fs.existsSync("./test/pathTesting/.comments/test1.txt.comment"),
      true,
      `./test/pathTesting/.comments/test1.txt.comment did not set correctly.`
    );
  });

  it("Set's a `.comment` file where `.comments` does exists", () => {
    assert.strictEqual(createCommentsFolder("./test/pathTesting"), 0);

    assert.strictEqual(
      storage.setCommentFile("./test/pathTesting/test2.txt", "demo"),
      0,
      `setCommentFile() failed.`
    );

    assert.strictEqual(
      fs.existsSync("./test/pathTesting/.comments/test2.txt.comment"),
      true
    );
  });

  it("Set's a `.comment` file for `./` in `./`'s parent", () => {
    assert.strictEqual(
      storage.setCommentFile("./test/pathTesting/nested", "demo"),
      0
    );

    assert.strictEqual(
      fs.existsSync("./test/pathTesting/.comments/nested.comment"),
      true
    );
  });

  it("Set's a `.comment` file for `../` in `./`'s grandparent", () => {
    assert.strictEqual(
      storage.setCommentFile(
        path.resolve("./test/pathTesting/nested/doubleNest/../"),
        "demo"
      ),
      0
    );

    assert.strictEqual(
      fs.existsSync("./test/pathTesting/.comments/nested.comment"),
      true
    );
  });

  it("Writes the correct value into a `.comment` file", () => {
    assert.strictEqual(
      storage.setCommentFile("./test/pathTesting/test1.txt", "demo"),
      0
    );

    assert.strictEqual(
      fs.readFileSync("./test/pathTesting/.comments/test1.txt.comment", "utf8"),
      "demo\n"
    );
  });
});

//deleteSingleCommentFile()
describe("Tests `deleteSingleCommentFile()`: ", () => {
  it("Deletes a `.comment` and keeps it's `.comments`", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo");
    storage.setCommentFile("./test/pathTesting/test2.txt", "demo");
    assert.strictEqual(
      storage.deleteSingleCommentFile("./test/pathTesting/test1.txt"),
      0
    );

    assert.strictEqual(
      fs.existsSync("./test/pathTesting/.comments/test1.txt.comment"),
      false
    );

    assert.strictEqual(fs.existsSync("./test/pathTesting/.comments"), true);
  });

  it("Deletes a `.comment` and removes it's `.comments`", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo");
    assert.strictEqual(
      storage.deleteSingleCommentFile("./test/pathTesting/test1.txt"),
      0
    );

    assert.strictEqual(
      fs.existsSync("./test/pathTesting/.comments/test1.txt.comment"),
      false
    );

    assert.strictEqual(fs.existsSync("./test/pathTesting/.comments"), false);
  });

  it("Fails when given a valid file path with no corresponding `.comment`", () => {
    storage.setCommentFile("./test/pathTesting/test1.txt", "demo");
    assert.strictEqual(
      storage.deleteSingleCommentFile("./test/pathTesting/test2.txt"),
      1
    );
  });

  it("Fails when given a valid file path with no corresponding `.comments`", () => {
    assert.strictEqual(
      storage.deleteSingleCommentFile("./test/pathTesting/test2.txt"),
      1
    );
  });

  it("Fails when given an invalid directory", () => {
    assert.strictEqual(
      storage.deleteSingleCommentFile("./fakePath/fakerPath.fake"),
      1
    );
  });
});

//commentsFolderExists()
describe("Tests `commentsFolderExists()`:", () => {
  it("Returns true when given path to a `.comments` directory", () => {
    assert.strictEqual(createCommentsFolder("./test/pathTesting/"), 0);
    assert.strictEqual(
      storage.commentsFolderExists("./test/pathTesting/"),
      true
    );
  });

  it("Returns false when given an invalid path", () => {
    assert.strictEqual(
      storage.commentsFolderExists("./test/pathTesting/"),
      false
    );
  });

  it("Returns false when given a path to a file called `.comments`", () => {
    let file = fs.openSync("./test/pathTesting/.comments", "a");
    fs.closeSync(file);

    assert.strictEqual(
      storage.commentsFolderExists("./test/pathTesting/"),
      false
    );
  });
});

//loadFiles()
describe("Tests `loadFiles()`:", () => {
  it("Correctly returns the files of a directory in a string array", () => {
    expect(storage.loadFiles("./test/pathTesting")).to.include.members([
      "deleteTest.txt",
      "nested",
      "test1.txt",
      "test2.txt",
    ]);
  });

  it("Correctly returns the files of a directory in a string array, skipping `.comments`", () => {
    assert.strictEqual(createCommentsFolder("./test/pathTesting"), 0);

    expect(storage.loadFiles("./test/pathTesting"))
      .to.include.members([
        "deleteTest.txt",
        "nested",
        "test1.txt",
        "test2.txt",
      ])
      .does.not.include(".comments");
  });
});

//loadComments()
describe("Tests `loadComments()`:", () => {
  it("Correctly reads all the comments from a directory", () => {
    assert.strictEqual(
      storage.setCommentFile(
        path.resolve("./test/pathTesting/test1.txt"),
        "test1.txt comment"
      ),
      0
    );

    assert.strictEqual(
      storage.setCommentFile(
        path.resolve("./test/pathTesting/test2.txt"),
        "test2.txt comment"
      ),
      0
    );

    expect(
      Object.assign({}, storage.loadComments("./test/pathTesting"))
    ).to.eql({
      "test1.txt": "test1.txt comment\n",
      "test2.txt": "test2.txt comment\n",
    });
  });
});

//returnCurrentDirectoryParentComment()
describe("Tests `returnCurrentDirectoryParentComment()`:", () => {
  it('Returns "" if the parent does not have a `.comments`', () => {
    assert.strictEqual(
      storage.commentsFolderExists("./test/pathTesting"),
      false
    );

    assert.strictEqual(
      storage.returnCurrentDirectoryParentComment("./test/pathTesting/nested"),
      ""
    );
  });

  it("Returns the correct comment from it's parent", () => {
    assert.strictEqual(
      storage.setCommentFile(
        path.resolve("./test/pathTesting/nested"),
        "nested comment"
      ),
      0
    );

    assert.strictEqual(
      storage.commentsFolderExists("./test/pathTesting"),
      true
    );

    assert.strictEqual(
      storage.returnCurrentDirectoryParentComment("./test/pathTesting/nested"),
      "[Parent] nested comment\n"
    );
  });
});

//returnCurrentDirectoryGrandparentComment()
describe("Tests `returnCurrentDirectoryGrandparentComment()`:", () => {
  it('Returns "" if the grandparent does not have a `.comments`', () => {
    assert.strictEqual(
      storage.commentsFolderExists("./test/pathTesting"),
      false
    );

    assert.strictEqual(
      storage.returnCurrentDirectoryGrandparentComment(
        "./test/pathTesting/nested/doubleNest"
      ),
      ""
    );
  });

  it("Returns the correct comment from it's grandparent", () => {
    assert.strictEqual(
      storage.setCommentFile(
        path.resolve("./test/pathTesting/nested"),
        "nested comment"
      ),
      0
    );

    assert.strictEqual(
      storage.commentsFolderExists("./test/pathTesting"),
      true
    );

    assert.strictEqual(
      storage.returnCurrentDirectoryGrandparentComment(
        "./test/pathTesting/nested/doubleNest"
      ),
      "[Grandparent] nested comment\n"
    );
  });
});

//IfPathIsValid()
describe("Tests `ifPathIsValid()`: ", () => {
  it("Returns false with an invalid path", () => {
    assert.strictEqual(
      storage.ifPathIsValid("./fakePath/fakeFile.fake"),
      false
    );
  });

  it("Returns true with a valid path", () => {
    assert.strictEqual(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/"),
      true
    );
  });
});

//ifPathIsValidAndNotFile()
describe("Tests `ifPathIsValidAndNotFile()`: ", () => {
  it("Returns false with an invalid non-file path", () => {
    assert.strictEqual(
      storage.ifPathIsValidAndNotFile("./fakePath/fakeFile.fake"),
      false
    );
  });

  it("Returns false with an invalid file path", () => {
    assert.strictEqual(
      storage.ifPathIsValidAndNotFile("./fakePath/fakerPath/"),
      false
    );
  });

  it("Returns false with a valid file path", () => {
    assert.strictEqual(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/test1.txt"),
      false
    );
  });

  it("Returns true with a valid non-file path", () => {
    assert.strictEqual(
      storage.ifPathIsValidAndNotFile("./test/pathTesting/"),
      true
    );
  });
});

//getCommentsFilePath()
describe("Tests `getCommentsFilePath()`:", () => {
  it("Returns the absolute path to a given files `.comment`", () => {
    assert.strictEqual(
      storage.setCommentFile("./test/pathTesting/test1.txt", "wow"),
      0
    );

    const absolutePathToTarget = path.resolve("./test/pathTesting/test1.txt");
    const absolutePathToComment = path.resolve(
      "./test/pathTesting/.comments/test1.txt.comment"
    );

    assert.strictEqual(
      getCommentsFilePath(absolutePathToTarget),
      absolutePathToComment
    );
  });
});

//getFileNameFromPath()
describe("Tests `getFileNameFromPath()`:", () => {
  it("Returns the last part of the file path", () => {
    assert.strictEqual(
      getFileNameFromPath("./test/pathTesting/test1.txt"),
      "test1.txt"
    );
  });
});
