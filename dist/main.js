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
   for (var rolename in ROLES) {
      console.log("Build - " + rolename);
      var role = ROLES[rolename];
      var creeps = _.filter(Game.creeps, (creep) => creep.memory.role == role.name);
      console.log(role.name + ': ' + creeps.length);

      if(!Game.spawns['Spawn1'].spawning) {
         if (rolename != "harvester" && !harvesterBuilt()) {
            console.log("Skipping build of " + role.name + " in order to prioritize harvester");
         } else if (creeps.length < role.quantity) {
            console.log("creeps not at capacity for " + role.name);
            var newName = role.name + Game.time;
            if (Game.spawns['Spawn1'].spawnCreep(role.ability, newName,{dryRun:true}) == OK) {
               console.log('Spawning new '+ role.name +': ' + newName);
               Game.spawns['Spawn1'].spawnCreep(role.ability, newName,
                  {memory: {role: role.name}});
            } else {
               console.log("cannot create " + role.name);
            }
         } else {
            console.log("at capacity for " + role.name);
         }

      }
   }
}

module.exports.loop = function () {
   cleanup();
   build();

   for(var name in Game.creeps) {
      var creep = Game.creeps[name];
      ROLES[creep.memory.role].run(creep);
   }
}
