var frame = [];
var logger = { 
   entry : function(name) {
      frame.push(name);
   },
   exit : function(name) {
      frame.pop();
   },
   debug: function(stmt) {
      console.log("[DEBUG] " + frame[frame.length-1] + " - " + stmt);
   }
};
module.export = logger;
