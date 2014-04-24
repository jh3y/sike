assert = require("assert")
sike = require("../lib/sike")
suite "sike", ->
	suite "create", ->
		test "should throw an error when empty options", ->
			assert.throws (->
				testSike = sike.create()
				testSike.initialize()
				return
			), Error
			return
		test "should throw an error when interval is not set", ->
			assert.throws (->
				testSike = sike.create (
					interval: true
					duration: "1h"
				)
				testSike.initialize()
				return
			), Error
			return
	return
return