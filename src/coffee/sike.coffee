colors = require "colors"
moment = require "moment"
pkg = require "../package.json"

exports.create = (options) ->
	return new sike options

sike = (options) ->
	this.defaults = 
		bells: 2
		message: "Get up and move around!"
		timeMessage: "Time to move about!"
		dontShowTimestamp: false
	extend = (a, b) ->
		for key of b
			if b.hasOwnProperty(key)
				a[key] = b[key]
		a
	this.options = extend(this.defaults, options)
	this.bells = if (typeof(parseInt(this.options.bells, 10)) is "number") then this.options.bells else defaults.bells
	this.message = this.options.message;
	this.timeMessage = this.options.timeMessage;
	this.showTimestamp = if (this.options.dontShowTimestamp) then false else true
	this.interval = this.options.interval
	this.duration = this.options.duration
	this.time = this.options.time
	try 
		this.initialize()
	catch err
		this.log err.toString(), false, false, true
	this

sike::initialize = ->
	sike = this
	sike.sike = {}
	opts = 
		interval: "set to prompt every "
		duration: "set to promt in "
		time: "set to prompt at "
	for opt of opts
		if sike[opt] and (typeof (sike[opt]) is "string" or typeof (sike[opt]) is "number")
			if opt is "time"
				now = moment()
				time = moment(sike.time, "HH:mm")
				ms = time.diff(now)
			else
				try
					ms = sike.processTimeString(sike[opt])
				catch err
					this.log err.toString(), false, false, true
			if opt is "interval"
				sike.sike[opt] = setInterval(->
					sike.log sike.message, true, sike.showTimestamp
					return
				, sike.processTimeString(sike[opt]))
			else
				sike.sike[opt] = setTimeout(->
					sike.log sike.timeMessage, true, sike.showTimestamp
					return
				, ms)
			sike.log opts[opt] + sike[opt], false, true
		else if sike[opt]
			throw new Error "no " + [opt] + " set!"

sike::log = (msg, bells, timestamp, error) ->
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

exports.processTimeString = sike::processTimeString = (timeString) ->
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