var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');
var logger = require("logger");

function cleanup() {
   logger.entry("cleanup");
   for(var name in Memory.creeps) {
      if(!Game.creeps[name]) {
         delete Memory.creeps[name];
         logger.debug('Clearing non-existing creep memory:', name);
      }
   }
   logger.exit();
}

var ROLES = {
   harvester : { 
      name: "harvester",
      quantity: function() { return Memory.harvesters || 2} , 
      ability: [WORK,CARRY,MOVE],
      run: function(creep) { roleHarvester.run(creep); }
   }, 
   upgrader : { 
      name: "upgrader",
      quantity: function() { return Memory.upgraders || 2} , 
      ability: [WORK,CARRY,MOVE],
      run: function(creep) { roleUpgrader.run(creep); }
   }, 
   builder : {
      name: "builder",
      quantity: function() { return Memory.builders || 2} , 
      ability: [WORK,CARRY,MOVE],
      run: function(creep) { roleBuilder.run(creep); }
   }
}

function harvesterBuilt() {
   logger.entry("harvesterBuilt");
   var ret = _.filter(Game.creeps, (creep) => creep.memory.role == "harvester").length > 0;
   logger.exit();
   return ret;
}

function printSpawnCreep(returnCode) {
   logger.entry("printSpawnCreep");
   switch (returnCode) {
   case OK: 
      logger.debug("Spawn - OK");
      break;
   case ERR_NOT_OWNER:
      logger.debug("Spawn - ERR_NOT_OWNER");
      break;
   case ERR_NAME_EXISTS:
      logger.debug("Spawn - ERR_NAME_EXISTS");
      break;
   case ERR_BUSY:
      logger.debug("Spawn - ERR_BUSY");
      break;
   case ERR_NOT_ENOUGH_ENERGY:
      logger.debug("Spawn - ERR_NOT_ENOUGH_ENERGY");
      break;
   case ERR_INVALID_ARGS:
      logger.debug("Spawn - ERR_INVALID_ARGS");
      break;
   case ERR_RCL_NOT_ENOUGH:
      logger.debug("Spawn - ERR_RCL_NOT_ENOUGH");
      break;
   }
   logger.exit();
}

function build() {
   logger.entry("build");
   var buildRole = null, buildName;;
   for (var rolename in ROLES) {
      var role = ROLES[rolename];
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
      logger.debug(rolename + " count: " + creeps.length);

      if(Game.spawns['Spawn1'].spawning == null) {
         if (rolename != "harvester" && !harvesterBuilt()) {
            logger.debug("Skipping build of " + role.name + " in order to prioritize harvester");
         } else if (creeps.length < role.quantity()) {
            logger.debug("creeps not at capacity for " + role.name);
            buildName = role.name + Game.time;                                                          
            var ret;
            if ((ret = Game.spawns['Spawn1'].spawnCreep(role.ability, buildName,{dryRun:true})) == OK) {
               logger.debug('Queueing new '+ role.name +': ' + buildName);
               buildRole = role;
            } else {
               printSpawnCreep(ret);
            }
         } else {
            logger.debug("at max capacity "+ role.quantity() +" for " + role.name);
         }

      } else {
         logger.trace("spawning in progress");
      }
   }
   if (buildRole != null) {
      logger.info('Spawning new '+ buildRole.name +': ' + buildName);
      printSpawnCreep(Game.spawns['Spawn1'].spawnCreep(buildRole.ability, buildName,
         {memory: {role: buildRole.name}})) 
   }
   logger.exit();
}
var loop = 0;
module.exports.loop = function () {
   logger.entry("loop");
   cleanup();
   build();

   for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      ROLES[creep.memory.role].run(creep);
   }
   ++loop;
   logger.exit();
}
