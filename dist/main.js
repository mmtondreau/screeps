var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');


function cleanup() {
   for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
         delete Memory.creeps[name];
         console.log('Clearing non-existing creep memory:', name);
      }
   }
}

var ROLES = {
   harvester : { 
      name: "harvester",
      quantity: 2, 
      ability: [WORK,CARRY,MOVE],
      run: function(creep) { roleHarvester.run(creep); }
   }, 
   upgrader : { 
      name: "upgrader",
      quantity: 2, 
      ability: [WORK,CARRY,MOVE],
      run: function(creep) { roleUpgrader.run(creep); }
   }, 
   builder : {
      name: "builder",
      quantity: 2, 
      ability: [WORK,CARRY,MOVE],
      run: function(creep) { roleBuilder.run(creep); }
   }
}

function harvesterBuilt() {
   cleanup();
   var ret = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester").length > 0;
   console.log("harvesterBuilt - " + ret);
   return ret;
}

function build() {
   var buildRole = null, buildName;;
   for (var rolename in ROLES) {
      console.log("Build - " + rolename);
      var role = ROLES[rolename];
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
      console.log(role.name + ': ' + creeps.length);

      if(Game.spawns['Spawn1'].spawning == null) {
         if (rolename != "harvester" && !harvesterBuilt()) {
            console.log("Skipping build of " + role.name + " in order to prioritize harvester");
         } else if (creeps.length < role.quantity) {
            console.log("creeps not at capacity for " + role.name);
            buildName = role.name + Game.time;
            if (Game.spawns['Spawn1'].spawnCreep(role.ability, buildName,{dryRun:true}) == OK) {
               console.log('Queueing new '+ role.name +': ' + buildName);
               buildRole = role;
            } else {
               console.log("cannot create " + role.name);
            }
         } else {
            console.log("at capacity for " + role.name);
         }

      }
   }
   if (buildRole != null) {
      console.log('Spawning new '+ buildRole.name +': ' + buildName);
      switch (Game.spawns['Spawn1'].spawnCreep(buildRole.ability, buildName,
         {memory: {role: buildRole.name}})) {
      case OK: 
         console.log("Spawn - OK");
         break;
      case ERR_NOT_OWNER:
         console.log("Spawn - ERR_NOT_OWNER");
         break;
      case ERR_NAME_EXISTS:
         console.log("Spawn - ERR_NAME_EXISTS");
         break;
      case ERR_BUSY:
         console.log("Spawn - ERR_BUSY");
         break;
      case ERR_NOT_ENOUGH_ENERGY:
         console.log("Spawn - ERR_NOT_ENOUGH_ENERGY");
         break;
      case ERR_INVALID_ARGS:
         console.log("Spawn - ERR_INVALID_ARGS");
         break;
      case ERR_RCL_NOT_ENOUGH:
         console.log("Spawn - ERR_RCL_NOT_ENOUGH");
         break;
      }
   }
}
var int loop = 0;
module.exports.loop = function () {
   cleanup();
   build();

   for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      ROLES[creep.memory.role].run(creep);
   }
   ++loop;
}
