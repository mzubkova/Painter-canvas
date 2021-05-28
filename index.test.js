const createCanvas = require("./index");

describe("test of create canvas", function () {
  it("should be defined ", function () {
    expect(createCanvas).toBeDefined();
  });
  it("should be a function", function () {
    expect(typeof createCanvas).toBe("function");
  });
});
