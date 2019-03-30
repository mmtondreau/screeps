
var frame = [];

LOG_LEVELS = {
   TRACE: 0,
   DEBUG: 1,
   INFO: 2,
   WARN: 3,
   ERROR: 4
}
                        
var logger = {
   logLevel: function() {
      return LOG_LEVELS[Memory.logLevel] || 1;
   },
   entry : function(name) {
      frame.push(name);
      logger.trace("entry");

   },
   exit : function(name) {
      logger.trace("exit");
      frame.pop();
   },
   debug: function(stmt) {
      if (logger.logLevel() <= LOG_LEVELS.DEBUG) {
         console.log("[DEBUG] " + frame[frame.length-1] + " - " + stmt);
      }
   },
   trace: function(stmt) {
      if (logger.logLevel() <= LOG_LEVELS.TRACE) {
         console.log("[TRACE] " + frame[frame.length-1] + " - " + stmt);
      }
   },
   info: function(stmt) {
      if (logger.logLevel() <= LOG_LEVELS.INFO) {
         console.log("[INFO] " + frame[frame.length-1] + " - " + stmt);
      }
   },
   warn: function(stmt) {
      if (logger.logLevel() <= LOG_LEVELS.WARN) {
         console.log("[WARN] " + frame[frame.length-1] + " - " + stmt);
      }
   },
   error: function(stmt) {
      console.log("[ERROR] " + frame[frame.length-1] + " - " + stmt);
   }
};

module.exports = logger;
