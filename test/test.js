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
      test("should throw an error when time flag is set without a value", function() {
        assert.throws((function() {
          var testSike;
          testSike = sike.create({
            time: true
          });
        }), Error);
      });
    });
    suite("parseTime", function() {
      test("\"1s\" should return 1000", function() {
        assert.equal(1000, sike.parseTime("1s"));
      });
      test("\"1m\" should return 60000", function() {
        assert.equal(60000, sike.parseTime("1m"));
      });
      test("\"1h\" should return 3600000", function() {
        assert.equal(3600000, sike.parseTime("1h"));
      });
      test("\"1h20m\" should return 4800000", function() {
        assert.equal(4800000, sike.parseTime("1h20m"));
      });
      test("\"1\" should throw an error", function() {
        assert.throws((function() {
          sike.parseTime("1");
        }), Error);
      });
      test("\"1hh23m\" should throw an error because of two \"h\"", function() {
        assert.throws((function() {
          sike.parseTime("1hh23m");
        }), Error);
      });
      test("\"1h20\" should throw an error because of second digits aren't quantified", function() {
        assert.throws((function() {
          sike.parseTime("1h20");
        }), Error);
      });
      test("empty string should throw an error", function() {
        assert.throws((function() {
          sike.parseTime();
        }), Error);
      });
      test("random string(\"wfr23hrt34mg52cg345y43g5f2\"), should throw an error", function() {
        assert.throws((function() {
          sike.parseTime("wfr23hrt34mg52cg345y43g5f2");
        }), Error);
      });
    });
  });

}).call(this);
