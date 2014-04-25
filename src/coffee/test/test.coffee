assert = require("assert")
sike = require("../lib/sike")
suite "sike", ->
	suite "create", ->
		test "should throw an error when empty options", ->
			assert.throws (->
				testSike = sike.create()
				return
			), Error
			return
		test "should throw an error when interval flag is set without a value", ->
			assert.throws (->
				testSike = sike.create (
					interval: true
				)
				return
			), Error
			return
		test "should throw an error when duration flag is set without a value", ->
			assert.throws (->
				testSike = sike.create (
					duration: true
				)
				return
			), Error
			return
		test "should throw an error when time flag is set without a value", ->
			assert.throws (->
				testSike = sike.create (
					time: true
				)
				return
			), Error
			return
		return
	suite "parseTime", ->
		test "\"1s\" should return 1000", ->
			assert.equal 1000, sike.parseTime("1s")
			return
		test "\"1m\" should return 60000", ->
			assert.equal 60000, sike.parseTime("1m")
			return
		test "\"1h\" should return 3600000", ->
			assert.equal 3600000, sike.parseTime("1h")
			return
		test "\"1h20m\" should return 4800000", ->
			assert.equal 4800000, sike.parseTime("1h20m")
			return
		test "\"1\" should throw an error", ->
			assert.throws (->
				sike.parseTime "1"
				return
			), Error
			return
		test "\"1hh23m\" should throw an error because of two \"h\"", ->
			assert.throws (->
				sike.parseTime "1hh23m"
				return
			), Error
			return
		test "\"1h20\" should throw an error because of second digits aren't quantified", ->
			assert.throws (->
				sike.parseTime "1h20"
				return
			), Error
			return
		test "empty string should throw an error", ->
			assert.throws (->
				sike.parseTime()
				return
			), Error
			return
		test "random string(\"wfr23hrt34mg52cg345y43g5f2\"), should throw an error", ->
			assert.throws (->
				sike.parseTime "wfr23hrt34mg52cg345y43g5f2"
				return
			), Error
			return
		return
	return