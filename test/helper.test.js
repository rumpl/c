// @ts-nocheck
/* Capturing console logs, see https://glebbahmutov.com/blog/capture-all-the-logs/ */

const helpers = require("../src/helpers");
const rewire = require("rewire");
const assert = require("assert");
const fs = require("fs");
const path = require("path");
const expect = require("chai").expect;
const util = require("util");

const app = rewire("../src/helpers.js");
const maxLength = app.__get__("maxLength");
const print = app.__get__("print");

//TODO: test print()

//TODO: test printFileComments()

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

  it("Returns the length of the only string when given a single string", () => {
    assert.strictEqual(maxLength(["five+four"]), "five+four".length);
  });
});
