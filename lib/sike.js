(function() {
  var colors, moment, pkg, sike;

  colors = require("colors");

  moment = require("moment");

  pkg = require("../package.json");

  exports.create = function(options) {
    return new sike(options);
  };

  sike = function(options) {
    var extend;
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
    if (this.options.interval && ((typeof this.options.interval === "string") || (typeof this.options.interval === "number"))) {
      this.interval = this.options.interval;
    } else {
      throw new Error("no interval set!");
    }
    if (this.options.duration && ((typeof this.options.duration === "string") || (typeof this.options.duration === "number"))) {
      this.duration = this.options.duration;
    } else {
      throw new Error("no interval set!");
    }
    if (this.options.time && ((typeof this.options.time === "string") || (typeof this.options.time === "number"))) {
      this.time = this.options.time;
    } else {
      throw new Error("no interval set!");
    }
    return this;
  };

  exports.initialize = sike.prototype.initialize = function() {
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
            ms = sike.parseTstring(sike[opt]);
          } catch (_error) {
            err = _error;
            this.log(err.toString(), false, false, true);
          }
        }
        if (opt === "interval") {
          sike.sike[opt] = setInterval(function() {
            sike.log(sike.message, true, sike.showTimestamp);
          }, sike.parseTstring(sike[opt]));
        } else {
          sike.sike[opt] = setTimeout(function() {
            sike.log(sike.timeMessage, true, sike.showTimestamp);
          }, ms);
        }
        _results.push(sike.log(opts[opt] + sike[opt], false, true));
      } else {
        _results.push(void 0);
      }
    }
    return _results;
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

  exports.parseTstring = sike.prototype.parseTstring = function(timeString) {
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
