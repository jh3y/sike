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
          testSike.initialize();
        }), Error);
      });
      return test("should throw an error when interval is not set", function() {
        assert.throws((function() {
          var testSike;
          testSike = sike.create({
            interval: true,
            duration: "1h"
          });
          testSike.initialize();
        }), Error);
      });
    });
  });

  return;

}).call(this);
