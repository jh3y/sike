(function() {
  var colors, exports, moment, pkg, sike;

  colors = require("colors");

  moment = require("moment");

  pkg = require("../package.json");

  exports = module.exports = sike = function(options) {
    var extend, type;
    sike = this;
    sike.defaults = {
      bells: 2,
      message: "Get up and move around!",
      timeMessage: "Time to move about!",
      dontShowTimestamp: false
    };
    extend = function(a, b) {
      var key;
      for (key in b) {
        if (b.hasOwnProperty(key) && b[key] !== void 0) {
          a[key] = b[key];
        }
      }
      return a;
    };
    sike.options = extend(sike.defaults, options);
    sike.bells = typeof (parseInt(sike.options.bells, 10)) === "number" ? sike.options.bells : defaults.bells;
    sike.message = sike.options.message;
    sike.timeMessage = sike.options.timeMessage;
    sike.showTimestamp = sike.options.dontShowTimestamp ? false : true;
    if (sike.options.interval === undefined && sike.options.duration === undefined && sike.options.time === undefined) {
      throw new Error("no alert options set!");
    }
    for (type in sike.types) {
      if (sike.options[type] && ((typeof sike.options[type] === "string") || (typeof sike.options[type] === "number"))) {
        sike[type] = sike.options[type];
      } else if (typeof sike.options[type] === "boolean") {
        throw new Error("no " + type + " set!");
      }
    }
    return sike;
  };

  sike.prototype.types = {
    interval: "set to prompt every ",
    duration: "set to prompt in ",
    time: "set to prompt at "
  };

  exports.initialize = sike.prototype.initialize = function() {
    var err, ms, now, time, type;
    sike = this;
    sike.sike = {};
    for (type in sike.types) {
      if (sike[type] && (typeof sike[type] === "string" || typeof sike[type] === "number")) {
        try {
          if (type === "time") {
            now = moment();
            time = moment(sike.time, "HH:mm");
            ms = time.diff(now);
          } else {
            ms = sike.parseTime(sike[type]);
          }
          if (type === "interval") {
            sike.sike[type] = setInterval(function() {
              sike.log(sike.message, true, sike.showTimestamp);
            }, ms);
          } else {
            sike.sike[type] = setTimeout(function() {
              sike.log(sike.timeMessage, true, sike.showTimestamp);
            }, ms);
          }
          sike.log(sike.types[type] + sike[type], false, true);
        } catch (_error) {
          err = _error;
          this.log(err.toString(), false, false, true);
        }
      }
    }
    return sike;
  };

  exports.log = sike.prototype.log = function(msg, bells, timestamp, error) {
    var playBells;
    playBells = function(amount) {
      var i, _results;
      i = 0;
      _results = [];
      while (i < amount) {
        console.log("\u0007");
        _results.push(i++);
      }
      return _results;
    };
    if (error) {
      playBells(1);
      console.log("[", "sike".red, "]", msg.yellow);
    } else {
      if (bells) {
        playBells(this.bells);
      }
      if (timestamp) {
        console.log("[", "sike".magenta, "]", msg.cyan + ".".cyan, "It's".blue, moment().format("h:mm a").blue + ".".blue);
      } else {
        console.log("[", "sike".magenta, "]", msg.cyan);
      }
    }
  };

  exports.parseTime = sike.prototype.parseTime = function(timeString) {
    var defaultUnit, settings, time, unit, units;
    time = 0;
    settings = {};
    defaultUnit = "s";
    units = {
      hours: /\d*(?=h)/,
      minutes: /\d*(?=m)/,
      seconds: /\d*(?=s)/
    };
    if (timeString !== undefined && timeString !== null && timeString.match(/[^hms0-9]|h{2,}|m{2,}|s{2,}/) === null && timeString.match(/h|m|s/) !== null && timeString.match(/[hms]$/) !== null) {
      for (unit in units) {
        if (timeString.indexOf(unit.substr(0, 1)) !== -1) {
          settings[unit] = timeString.match(units[unit])[0] !== null ? parseInt(timeString.match(units[unit])[0], 10) : false;
          if (settings[unit] && typeof settings[unit] === "number") {
            switch (unit) {
              case "hours":
                time = time + (settings.hours * 3600000);
                break;
              case "minutes":
                time = time + (settings.minutes * 60000);
                break;
              case "seconds":
                time = time + (settings.seconds * 1000);
            }
          }
        }
      }
    } else {
      throw new Error("invalid time string: " + timeString);
    }
    return time;
  };

}).call(this);
