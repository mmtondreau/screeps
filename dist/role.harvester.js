
var roleHarvester = {

   /** @param {Creep} creep **/
   run: function(creep) {
      if(creep.carry.energy < creep.carryCapacity) {
         if (creep.memory.target != null) {
            creep.memory.target = null;
         }
         if (creep.memory.source == null) {
            var sources = creep.room.find(FIND_SOURCES);
            creep.memory.source = sources(Math.floor(Math.random()*sources)];
         }
         if(creep.harvest(creep.memory.source) == ERR_NOT_IN_RANGE) {
            creep.moveTo(creep.memory.source, {visualizePathStyle: {stroke: '#ffaa00'}});
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
               creep.memory.target = targets[Math.floor(Math.random() * targets.length)];
            }
         } else {
            if(creep.transfer(creep.memory.target, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(creep.memory.target, {visualizePathStyle: {stroke: '#ffffff'}});
            }
         }

      }
   }
};

module.exports = roleHarvester;
