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
return