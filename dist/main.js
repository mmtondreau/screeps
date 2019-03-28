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
   return _.filter(Game.creeps, (creep) => creep.memory.role == "harvester").length > 0;
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
            break;
         }
         if(creeps.length < role.quantity) {
            var newName = role.name + Game.time;
            console.log('Spawning new '+ role.name +': ' + newName);
            Game.spawns['Spawn1'].spawnCreep(role.ability, newName,
               {memory: {role: role.name}});
         }
      }
      if(Game.spawns['Spawn1'].spawning) {
         var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
         Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
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
