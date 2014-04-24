(function() {
  var assert, sike;

  assert = require("assert");

  sike = require("../lib/sike");

  suite("sike", function() {
    suite("create", function() {
      test("should throw an error when empty options", function() {
        assert.throws((function() {
          var testSike;
          testSike = sike.create();
        }), Error);
      });
      test("should throw an error when interval flag is set without a value", function() {
        assert.throws((function() {
          var testSike;
          testSike = sike.create({
            interval: true
          });
        }), Error);
      });
      test("should throw an error when duration flag is set without a value", function() {
        assert.throws((function() {
          var testSike;
          testSike = sike.create({
            duration: true
          });
        }), Error);
      });
      return test("should throw an error when time flag is set without a value", function() {
        assert.throws((function() {
          var testSike;
          testSike = sike.create({
            time: true
          });
        }), Error);
      });
    });
  });

  return;

}).call(this);
