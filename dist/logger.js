function Logger() {
   var frame = [];
   this.entry = function(name) {
      frame.push(name);
   }

   this.exit = function(name) {
      frame.pop();
   }

   this.debug= function(stmt) {
      console.log("[DEBUG] " + frame[frame.length-1] + " - " + stmt);
   }
}
module.export = new Logger();;
