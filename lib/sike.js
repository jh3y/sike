#!/usr/bin/env node
var program = require('commander'),
	moment = require('moment'),
	colors = require('colors'),
	pkg = require('../package.json'),
	defaults = {
		bells: 2,
		message: "Get up and move around!",
		timeMessage: "Time to move about!"
	},
	sikelog,
	introduce,
	processTimeString;
program
	.version(pkg.version)
	.option('-i, --interval [interval]', 'sets alert interval')
	.option('-d, --duration [duration]', 'sets duration until alert')
	.option('-t, --time [time]', 'sets alert time')
	.option('-m, --message [message]', 'sets interval message')
	.option('--timeMessage [timeMessage]', 'sets time message')
	.option('--dontShowTimestamp', 'defines whether timestamp message is shown with alerts')
	.option('-b, --bells [bells]', 'set number of bells on alert.');
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

/* processTimeString(string)
 * processes the given interval string and returns the timeout interval.
 */
processTimeString = function (timeString) {
	var time = 0,
		settings = {},
		defaultUnit = "s",
		units = {
			"hours": /(\d*)h/,
			"minutes": /h*(\d*)m/,
			"seconds": /m*(\d*)s/
		};
	if (timeString.indexOf("h") === -1 && timeString.indexOf("m") === -1 && timeString.indexOf("s") === -1) {
		timeString += defaultUnit;
	}
	for(unit in units) {
		if (timeString.indexOf(unit.substr(0,1)) !== -1) {
			settings[unit] = (timeString.match(units[unit])[1] !== null) ? parseInt(timeString.match(units[unit])[1], 10): false; 
			if (settings[unit] && typeof(settings[unit]) === "number") {
				switch(unit) {
					case "hours":
						time = time + (settings.hours * 3600000);
						break;
					case "minutes":
						time = time + (settings.minutes * 60000);
						break;
					case "seconds":
						time = time + (settings.seconds * 1000);
						break;
				}
			} else {
				console.error('sike: INVALID TIME STRING');
			}
		}
	}
	return time;
};
introduce = function () {
	console.log("");
	console.log("             ===============            ".grey + "sike".red);
	console.log("         |   ('     ___      ')         ".grey + "v:".red + pkg.version.red);
	console.log("         |         \\---/                ".grey);
	console.log("");
}
sikelog = function (msg, bells, notimestamp) {
	if (bells) {
		for (var i = 0; i < program.bells; i++) {
			console.log('\u0007');
		};
	}
	((notimestamp) ? console.log("[", "sike".magenta, "]", msg.cyan): console.log("[", "sike".magenta, "]", msg.cyan + ".".cyan, "It's".blue , moment().format("h:mm a").blue + ".".blue));
}
introduce();
if (process.argv.length === 2) {
	sikelog('check out help with "-h/--help" for getting started.', false, true);
	console.log("");
}
/* sike - extends default settings.*/
program.bells = (program.bells !== undefined && typeof(parseInt(program.bells, 10)) === "number") ? program.bells: defaults.bells;
program.message = (program.message !== undefined) ? program.message: defaults.message;
program.timeMessage = (program.timeMessage !== undefined) ? program.timeMessage: defaults.timeMessage;
if (program.interval) {
	var runner = setInterval(function() {
		sikelog(program.message, true, program.dontShowTimestamp);
	}, processTimeString(program.interval));
	sikelog("set to prompt every " + program.interval, false, true);
}
if (program.duration) {
	var duration = setTimeout(function() {
		sikelog(program.message, true, program.dontShowTimestamp);
	}, processTimeString(program.duration));
	sikelog("set to prompt in " + program.duration, false, true);
}
if (program.time) {
	var now = moment(),
		time = moment(program.time, "HH:mm");
	setTimeout(function() {
		sikelog(program.timeMessage, true, program.dontShowTimestamp);
	}, time.diff(now));
	sikelog("set to prompt at " + program.time, false, true);
}