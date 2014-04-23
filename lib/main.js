(function() {
  var colors, introduce, moment, newSike, pkg, program, sike;

  program = require("commander");

  moment = require("moment");

  colors = require("colors");

  pkg = require("../package.json");

  sike = require("./sike");

  program.version(pkg.version).option("-i, --interval [interval]", "sets alert interval").option("-d, --duration [duration]", "sets duration until alert").option("-t, --time [time]", "sets alert time").option("-m, --message [message]", "sets interval message").option("--timeMessage [timeMessage]", "sets time message").option("--dontShowTimestamp", "defines whether timestamp message is shown with alerts").option("-b, --bells [bells]", "set number of bells on alert.");

  program.on("--help", function() {
    console.log("  Examples:");
    console.log("");
    console.log("    $ sike --interval 1h30m");
    console.log("    $ sike -i 1h30m");
    console.log("    $ sike --duration 1h");
    console.log("    $ sike -d 1h");
    console.log("    $ sike --time 18:20");
    console.log("    $ sike -t 18:20");
    console.log("    $ sike --time 18:20 --timeMessage \"Get ready to go grab that flight now!\"");
    console.log("    $ sike --interval 2h --message \"Go grab a coffee\"");
    console.log("    $ sike -i 2h -m \"Go grab a coffee\"");
    console.log("    $ sike --interval 45m --bells 2");
    console.log("    $ sike -i 45m -b 2");
    console.log("");
  });

  program.parse(process.argv);

  introduce = function() {
    console.log("");
    console.log("             ===============            ".grey + "sike".red);
    console.log("         |   ('     ___      ')         ".grey + pkg.version.red);
    console.log("         |         \\---/                ".grey);
    console.log("");
  };

  introduce();

  newSike = sike.create({
    interval: program.interval,
    duration: program.duration,
    time: program.time
  });

  if (process.argv.length === 2) {
    console.log("[", "sike".magenta, "]", "check out help with \"-h/--help\" for getting started.".blue);
    console.log("");
  }

}).call(this);
