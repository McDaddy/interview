const chai = require("chai");
const { assert, expect, should } = chai;
const { querySearch, arrange } = require("./index.js");

/******************单元测试 demo start*******************/

describe("测试queryString", function () {
  it("测试http://sample.com/?a=1&b=2&c=xx&d#hash", function () {
    expect(querySearch("http://sample.com/?a=1&b=2&c=xx&d#hash")).to.be.equal({
      a: "1",
      b: "2",
      c: "xx",
      d: ""
    });
  });
});

describe("测试arrange", function () {
  it("测试arrange", function () {
    expect(arrange("William"));
});
/******************单元测试 demo end*******************/
