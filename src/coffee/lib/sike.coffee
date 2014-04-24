colors = require "colors"
moment = require "moment"
pkg = require "../package.json"
	
exports.create = (options) ->
	return new sike options

sike = (options) ->
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
	for type of sike.types
		if sike.options[type] and ((typeof(sike.options[type]) is "string") or (typeof(sike.options[type]) is "number"))
			sike[type] = sike.options[type]
		else if sike.options[type] isnt undefined
			throw new Error "no " + type + " set!"
	sike

sike::types = 
	interval: "set to prompt every "
	duration: "set to promt in "
	time: "set to prompt at "

exports.initialize = sike::initialize = ->
	sike = this
	sike.sike = {}
	for type of sike.types
		if sike[type] and (typeof (sike[type]) is "string" or typeof (sike[type]) is "number")
			if type is "time"
				now = moment()
				time = moment(sike.time, "HH:mm")
				ms = time.diff(now)
			else
				try
					ms = sike.parseTstring(sike[type])
				catch err
					this.log err.toString(), false, false, true
			if type is "interval"
				sike.sike[type] = setInterval(->
					sike.log sike.message, true, sike.showTimestamp
					return
				, sike.parseTstring(sike[type]))
			else
				sike.sike[type] = setTimeout(->
					sike.log sike.timeMessage, true, sike.showTimestamp
					return
				, ms)
			sike.log sike.types[type] + sike[type], false, true
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

exports.parseTstring = sike::parseTstring = (timeString) ->
	time = 0
	settings = {}
	defaultUnit = "s"
	units =
		hours: /(\d*)h/
		minutes: /h*(\d*)m/
		seconds: /m*(\d*)s/

	if timeString.indexOf("h") is -1 and timeString.indexOf("m") is -1 and timeString.indexOf("s") is -1
		timeString += defaultUnit
	for unit of units
		if timeString.indexOf(unit.substr(0,1)) isnt -1
			settings[unit] = if timeString.match(units[unit])[1] isnt null then parseInt(timeString.match(units[unit])[1], 10) else false
			if settings[unit] and typeof(settings[unit]) is "number"				
				switch unit
					when "hours"
						time = time + (settings.hours * 3600000)
					when "minutes"
						time = time + (settings.minutes * 60000)
					when "seconds"
						time = time + (settings.seconds * 1000)
			else
				throw new Error 'invalid time string'
	time