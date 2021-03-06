
function Logger() {
   this.LOG_LEVELS = {
      TRACE: 1,
      DEBUG: 2,
      INFO: 3,
      WARN: 4,
      ERROR: 5
   }
   this.frame = [];

};                        
Logger.prototype.logLevel = function() {
   return this.LOG_LEVELS[Memory.logLevel] || this.LOG_LEVELS.DEBUG;
}
Logger.prototype.entry = function(name) {
   this.frame.push(name);
   this.trace("entry");

}
Logger.prototype.exit = function(name) {
   this.trace("exit");
   this.frame.pop();
}
Logger.prototype.debug = function(stmt) {
   if (this.logLevel() <= this.LOG_LEVELS.DEBUG) {
      console.log("[DEBUG] " + this.frame[this.frame.length-1] + " - " + stmt);
   }
}
Logger.prototype.trace = function(stmt) {
   if (this.logLevel() <= this.LOG_LEVELS.TRACE) {
      console.log("[TRACE] " + this.frame[this.frame.length-1] + " - " + stmt);
   }
}
Logger.prototype.info = function(stmt) {
   if (this.logLevel() <= this.LOG_LEVELS.INFO) {
      console.log("[INFO] " + this.frame[this.frame.length-1] + " - " + stmt);
   }
}
Logger.prototype.warn = function(stmt) {
   if (this.logLevel() <= this.LOG_LEVELS.WARN) {
      console.log("[WARN] " + this.frame[this.frame.length-1] + " - " + stmt);
   }
}
Logger.prototype.error = function(stmt) {
   console.log("[ERROR] " + this.frame[this.frame.length-1] + " - " + stmt);
}

module.exports = new Logger();;
