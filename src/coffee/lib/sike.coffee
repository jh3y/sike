colors = require "colors"
moment = require "moment"
pkg = require "../package.json"
	
exports = module.exports = sike = (options) ->
	sike = this
	sike.defaults = 
		bells: 2
		message: "Get up and move around!"
		timeMessage: "Time to move about!"
		dontShowTimestamp: false
	extend = (a, b) ->
		for key of b
			if b.hasOwnProperty(key) and b[key] isnt undefined
				a[key] = b[key]
		a
	sike.options = extend(sike.defaults, options)
	sike.bells = if (typeof(parseInt(sike.options.bells, 10)) is "number") then sike.options.bells else defaults.bells
	sike.message = sike.options.message;
	sike.timeMessage = sike.options.timeMessage;
	sike.showTimestamp = if (sike.options.dontShowTimestamp) then false else true
	if sike.options.interval is `undefined` and sike.options.duration is `undefined` and sike.options.time is `undefined`
		throw new Error "no alert options set!"
	for type of sike.types
		if sike.options[type] and ((typeof(sike.options[type]) is "string") or (typeof(sike.options[type]) is "number"))
			sike[type] = sike.options[type]
		else if typeof(sike.options[type]) is "boolean"
			throw new Error "no " + type + " set!"
	sike
sike::types = 
	interval: "set to prompt every "
	duration: "set to prompt in "
	time: "set to prompt at "

exports.initialize = sike::initialize = ->
	sike = this
	sike.sike = {}
	for type of sike.types
		if sike[type] and (typeof (sike[type]) is "string" or typeof (sike[type]) is "number")
			try
				if type is "time"
					now = moment()
					time = moment(sike.time, "HH:mm")
					ms = time.diff(now)
				else	
					ms = sike.parseTime(sike[type])
				if type is "interval"
					sike.sike[type] = setInterval(->
						sike.log sike.message, true, sike.showTimestamp
						return
					, ms)
				else
					sike.sike[type] = setTimeout(->
						sike.log sike.timeMessage, true, sike.showTimestamp
						return
					, ms)
				sike.log sike.types[type] + sike[type], false, true
			catch err
				this.log err.toString(), false, false, true
	sike

exports.log = sike::log = (msg, bells, timestamp, error) ->
	playBells = (amount) ->
		i = 0
		while i < amount
			console.log "\u0007"
			i++
	if error
		playBells 1
		console.log "[", "sike".red, "]", msg.yellow
	else
		if bells
			playBells this.bells
		if timestamp
			console.log "[", "sike".magenta, "]", msg.cyan + ".".cyan, "It's".blue, moment().format("h:mm a").blue + ".".blue
		else
			console.log "[", "sike".magenta, "]", msg.cyan
	return

exports.parseTime = sike::parseTime = (timeString) ->
	time = 0
	settings = {}
	defaultUnit = "s"
	units =
		hours: /\d*(?=h)/
		minutes: /\d*(?=m)/
		seconds: /\d*(?=s)/
	if timeString isnt `undefined` and timeString isnt null and timeString.match(/[^hms0-9]|h{2,}|m{2,}|s{2,}/) is null and timeString.match(/h|m|s/) isnt null and timeString.match(/[hms]$/) isnt null
		for unit of units
			if timeString.indexOf(unit.substr(0,1)) isnt -1
				settings[unit] = if timeString.match(units[unit])[0] isnt null then parseInt(timeString.match(units[unit])[0], 10) else false
				if settings[unit] and typeof(settings[unit]) is "number"				
					switch unit
						when "hours"
							time = time + (settings.hours * 3600000)
						when "minutes"
							time = time + (settings.minutes * 60000)
						when "seconds"
							time = time + (settings.seconds * 1000)
	else
		throw new Error "invalid time string: " + timeString 
	time