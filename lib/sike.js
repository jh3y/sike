(function() {
  var colors, moment, pkg, sike;

  colors = require("colors");

  moment = require("moment");

  pkg = require("../package.json");

  exports.create = function(options) {
    return new sike(options);
  };

  sike = function(options) {
    var err, extend;
    this.defaults = {
      bells: 2,
      message: "Get up and move around!",
      timeMessage: "Time to move about!",
      dontShowTimestamp: false
    };
    extend = function(a, b) {
      var key;
      for (key in b) {
        if (b.hasOwnProperty(key)) {
          a[key] = b[key];
        }
      }
      return a;
    };
    this.options = extend(this.defaults, options);
    this.bells = typeof (parseInt(this.options.bells, 10)) === "number" ? this.options.bells : defaults.bells;
    this.message = this.options.message;
    this.timeMessage = this.options.timeMessage;
    this.showTimestamp = this.options.dontShowTimestamp ? false : true;
    this.interval = this.options.interval;
    this.duration = this.options.duration;
    this.time = this.options.time;
    try {
      this.initialize();
    } catch (_error) {
      err = _error;
      this.log(err.toString(), false, false, true);
    }
    return this;
  };

  sike.prototype.initialize = function() {
    var err, ms, now, opt, opts, time, _results;
    sike = this;
    sike.sike = {};
    opts = {
      interval: "set to prompt every ",
      duration: "set to promt in ",
      time: "set to prompt at "
    };
    _results = [];
    for (opt in opts) {
      if (sike[opt] && (typeof sike[opt] === "string" || typeof sike[opt] === "number")) {
        if (opt === "time") {
          now = moment();
          time = moment(sike.time, "HH:mm");
          ms = time.diff(now);
        } else {
          try {
            ms = sike.processTimeString(sike[opt]);
          } catch (_error) {
            err = _error;
            this.log(err.toString(), false, false, true);
          }
        }
        if (opt === "interval") {
          sike.sike[opt] = setInterval(function() {
            sike.log(sike.message, true, sike.showTimestamp);
          }, sike.processTimeString(sike[opt]));
        } else {
          sike.sike[opt] = setTimeout(function() {
            sike.log(sike.timeMessage, true, sike.showTimestamp);
          }, ms);
        }
        _results.push(sike.log(opts[opt] + sike[opt], false, true));
      } else if (sike[opt]) {
        throw new Error("no " + [opt] + " set!");
      } else {
        _results.push(void 0);
      }
    }
    return _results;
  };

  sike.prototype.log = function(msg, bells, timestamp, error) {
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

  exports.processTimeString = sike.prototype.processTimeString = function(timeString) {
    var defaultUnit, settings, time, unit, units;
    time = 0;
    settings = {};
    defaultUnit = "s";
    units = {
      hours: /(\d*)h/,
      minutes: /h*(\d*)m/,
      seconds: /m*(\d*)s/
    };
    if (timeString.indexOf("h") === -1 && timeString.indexOf("m") === -1 && timeString.indexOf("s") === -1) {
      timeString += defaultUnit;
    }
    for (unit in units) {
      if (timeString.indexOf(unit.substr(0, 1)) !== -1) {
        settings[unit] = timeString.match(units[unit])[1] !== null ? parseInt(timeString.match(units[unit])[1], 10) : false;
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
        } else {
          throw new Error('invalid time string');
        }
      }
    }
    return time;
  };

}).call(this);
