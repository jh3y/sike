#!/usr/bin/env node

// SIKE

/**
 * Module dependencies.
 */
var program = require('commander'),
	moment = require('moment'),
	defaults = {
		bells: 2,
		interval: "10s",
		message: "Go grab a coffee!",
		timeMessage: "Time for lunch!"
	};
program
	.version('0.0.1')
	.option('-i, --interval [interval]', 'Set alert interval')
	.option('-d, --duration [duration]', 'Set duration to alert')
	.option('-t, --time [time]', 'Set alert time')
	.option('-m, --message [message]', 'Set interval message')
	.option('--timeMessage [timeMessage]', 'Set time message')
	.option('-b, --bells [bells]', 'Set number of bells on alert.');
program.on('--help', function(){
	console.log('  Examples:');
	console.log('');
	console.log('    $ sike --interval 1h30m');
	console.log('    $ sike -i 1h30m');
	console.log('    $ sike --duration 1h');
	console.log('    $ sike -d 1h');
	console.log('    $ sike --time 18:20');
	console.log('    $ sike -t 18:20');
	console.log('    $ sike --time 18:20 --timeMessage "Get ready to go grab that flight now!"');
	console.log('    $ sike --interval 2h --message "Go grab a coffee"');
	console.log('    $ sike -i 2h -m "Go grab a coffee"');
	console.log('    $ sike --interval 45m --bells 2');
	console.log('    $ sike -i 45m -b 2');
	console.log('');
});
program.parse(process.argv);

/* processInterval(string)
 * processes the given interval string and returns the timeout interval.
 */
var processInterval = function (intervalString) {
	var interval = 0,
		settings = {},
		defaultUnit = "s",
		units = {
			"hours": /(\d*)h/,
			"minutes": /h*(\d*)m/,
			"seconds": /m*(\d*)s/
		};
	if (intervalString.indexOf("h") === -1 && intervalString.indexOf("m") === -1 && intervalString.indexOf("s") === -1) {
		intervalString += defaultUnit;
	}
	for(unit in units) {
		if (intervalString.indexOf(unit.substr(0,1)) !== -1) {
			settings[unit] = (intervalString.match(units[unit])[1] !== null) ? parseInt(intervalString.match(units[unit])[1], 10): false; 
			if (settings[unit] && typeof(settings[unit]) === "number") {
				switch(unit) {
					case "hours":
						interval = interval + (settings.hours * 3600000);
						break;
					case "minutes":
						interval = interval + (settings.minutes * 60000);
						break;
					case "seconds":
						interval = interval + (settings.seconds * 1000);
						break;
				}
			} else {
				console.error('sike: INVALID TIME INTERVAL STRING');
			}
		}
	}
	return interval;
};

program.bells = (program.bells !== undefined && typeof(parseInt(program.bells, 10)) === "number") ? program.bells: defaults.bells;
program.interval = (program.interval !== undefined) ? program.interval: defaults.interval;
program.message = (program.message !== undefined) ? program.message: defaults.message;
program.timeMessage = (program.timeMessage !== undefined) ? program.timeMessage: defaults.timeMessage;

var prompt = function () {
	for (var i = 0; i < program.bells; i++) {
		console.log('\u0007');
	};
	console.log(program.message);
}
if (program.interval) {
	var runner = setInterval(prompt, processInterval(program.interval));
}
if (program.duration) {
	var duration = setTimeout(prompt, processInterval(program.duration));
}
if (program.time) {
	var now = moment();
	var time = moment(program.time, "HH:mm");
	setTimeout(prompt, time.diff(now));
}