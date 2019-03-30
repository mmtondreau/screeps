var logger = require('logger');

var roleHarvester = {
   /** @param {Creep} creep **/
   run: function(creep) {
      logger.entry("run");
      logger.info("test");
      if(creep.carry.energy < creep.carryCapacity) {
         if (creep.memory.target != null) {
            creep.memory.target = null;
         }
         if (creep.memory.source == null) {
            var sources = creep.room.find(FIND_SOURCES);
            if (sources.length > 0) {
               var random = Math.floor(Math.random()*sources.length);
               creep.memory.source = sources[random].id;
            }
         }
         var source = Game.getObjectById(creep.memory.source);
         if(creep.harvest(source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
         }
      }
      else {                         
         if (creep.memory.source != null) {
            creep.memory.source = null;
         }
         if (creep.memory.target == null) {
            var targets = creep.room.find(FIND_STRUCTURES, {
               filter: (structure) => {
                  return (structure.structureType == STRUCTURE_EXTENSION ||
                     structure.structureType == STRUCTURE_SPAWN ||
                     structure.structureType == STRUCTURE_TOWER) && structure.energy < structure.energyCapacity;
               }
            });
            if(targets.length > 0) {
               creep.memory.target = targets[Math.floor(Math.random() * targets.length)].id;
            }
         } else {
            var target = Game.getObjectById(creep.memory.target);
            if(creep.transfer(target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
         }
      }
      logger.exit();
   }
};

module.exports = roleHarvester;
