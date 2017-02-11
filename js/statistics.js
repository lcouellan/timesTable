var statistics = { 
  template: "#statistics",
  data: function() {
    return globalStatistics
  },
  created: function() {
    globalStatistics.statistics = [];
    globalStatistics.displayTrain = false;
    globalStatistics.displayEvaluate = false;
    globalStatistics.trainExist = localStorageTrainExist() ? true : false;
    globalStatistics.evaluateExist = localStorageEvaluateExist() ? true : false;
  },
  methods: {
    //prepare the evaluate data for the generation of statistic (group)
    computeEvaluateStatistics: function() {
      globalStatistics.displayEvaluate = true;
      globalStatistics.displayTrain = false;
      globalStatistics.statistics = [];
      let evStorage = getLocalStorage()[LOCAL_EVALUATE_COL];
      let evStorages = [];
      for (let i=0; i < evStorage.length; i++) {
        if (i===0) {
          evStorages = evStorage[i].operations;
        } else {
          evStorages = evStorages.concat(evStorage[i].operations);
        }
        
      }

      let operations = [];
      //We group the same operations
      for (let i=0; i < evStorages.length; i++) {
        let agreg = {
          multiplier1 : null,
          multiplier2 : null,
          game : [],
          nb : 0
        };
        if (i==0) { //first occurence (array will always be empty)
          agreg.multiplier1 = evStorages[i].multiplier1;
          agreg.multiplier2 = evStorages[i].multiplier2;
          agreg.nb++;
          agreg.game.push({
            errors: evStorages[i].errors,
            time: evStorages[i].time,
            userChoices: evStorages[i].userChoices
          });
          operations.push(agreg);
        } else { //there were already one operations
          let index = this.getKeyIfValueExistEv(evStorages[i].multiplier1, evStorages[i].multiplier2, operations);
          if ((index != false || index === 0) && (operations[index].multiplier2 === evStorages[i].multiplier2)) {

            operations[index].game.push({
              errors: evStorages[i].errors,
              time: evStorages[i].time,
              userChoices: evStorages[i].userChoices
            });
            operations[index].nb++;
          } else { //first operation we find
            agreg.multiplier1 = evStorages[i].multiplier1;
            agreg.multiplier2 = evStorages[i].multiplier2;
            agreg.nb++;
            agreg.game.push({
              errors: evStorages[i].errors,
              time: evStorages[i].time,
              userChoices: evStorages[i].userChoices
            });
            operations.push(agreg);
          }
        }
      }
      //we generate and store the statistics
      this.generateEvaluateStatistics(operations);
    },
    //generate the statistics for evaluate data and store them
    generateEvaluateStatistics: function(operations) {
      for (let i=0; i < operations.length;i++) { //loop on each operation
        let stats = {
          multiplier1 : operations[i].multiplier1,
          multiplier2 : operations[i].multiplier2,
          nb : operations[i].nb,
          errors : null,
          averageTime : null,
          averageError : null
        };
        for (let j=0; j < operations[i].game.length; j++) { //loop on each attempts
          if (j==0) { //we initialize the object
              stats.errors = operations[i].game[j].userChoices;
              stats.averageTime = operations[i].game[j].time;
              stats.averageError = operations[i].game[j].errors;
          } else {  //we add the value of former attempts to the stats
            stats.averageTime += operations[i].game[j].time;
            stats.averageError += operations[i].game[j].errors;

            //we add errors if they doesn't already exist
            let errors = operations[i].game[j].userChoices;
            for (let z=0; z < errors.length;z++) {
              if (!this.valueInArrayExist(errors[z], stats.errors)) {
                stats.errors.push(errors[z]);
              }
            }
          }
        }

        //we clean and compute average
        let result = stats.multiplier1 * stats.multiplier2;
        let index = stats.errors.indexOf(result);
        if (index != -1) {
          stats.errors.splice(index, 1);
        }
        stats.averageTime = stats.averageTime / stats.nb;

        if (stats.averageError != 0) {
          stats.averageError = stats.averageError / stats.nb;
        }

        //we store the stats in the store
        globalStatistics.statistics.push(stats);
      }
    },
    //prepare the train data for the generation of statistic (group)
    computeTrainStatistics: function() {
      globalStatistics.displayTrain = true;
      globalStatistics.displayEvaluate = false;
      globalStatistics.statistics = [];
      let trainStorage = getLocalStorage()[LOCAL_TRAIN_COL];
      let tables = [];
      //We group the same operations
      for (let i=0; i < trainStorage.length; i++) {
        let agreg = {
          game : [],
          table : null,
          nb : 0
        };
        if (i==0) { //first occurence (array will always be empty)
          agreg.table = trainStorage[i].table;
          agreg.nb++;
          agreg.game.push(trainStorage[i].operations);
          tables.push(agreg);
        } else { //there were already one training on this table
          let index = this.getKeyIfValueExistTrain(trainStorage[i].table, tables);
          if (index != false || index === 0) {
            tables[index].game.push(trainStorage[i].operations);
            tables[index].nb++;
          } else { //first training we find on this table
            agreg.game.push(trainStorage[i].operations);
            agreg.table = trainStorage[i].table;
            agreg.nb++;
            tables.push(agreg);
          }
        }       
      }
      //we generate and store the statistics
      this.generateTrainStatistics(tables);
    },
    //generate the statistics for train data and store them
    generateTrainStatistics : function(tables) {
      //we generate the statistics of each operations
      for (let i=0; i < tables.length; i++) { //we loop on each table
        let stats = {
          stat : [],
          table : tables[i].table,
          nb : tables[i].nb
        };
        for (let j=0; j < tables[i].game.length; j++) { //we loop on each attempt
          //we create one stats by table
          for (let z=0; z < tables[i].game[j].length; z++) { //we loop on each attempt operations
            let index = (tables[i].game[j][z].multiplier)-1;
            //we create one stat by operations
            if (j == 0) {
              let stat = {
                multiplier : tables[i].game[j][z].multiplier,
                errors : tables[i].game[j][z].userChoices,
                averageTime : tables[i].game[j][z].time,
                averageError : tables[i].game[j][z].error
              };
              stats.stat[index] = stat;
            } else { //then we update it with every attempt
              stats.stat[index].averageTime += tables[i].game[j][z].time;
              stats.stat[index].averageError += tables[i].game[j][z].error;
              //if one error is new we add it
              for (let y=0; y < tables[i].game[j][z].userChoices.length; y++) { //we loop on each operations error
                let error = tables[i].game[j][z].userChoices[y];
                if (stats.stat[index].errors.indexOf(error) === -1) {
                  stats.stat[index].errors.push(error);
                }
              }
            }
          }
        }

        //Then we clean the result and do the stats:
        for (let z=0; z < stats.stat.length; z++) {
          let result = stats.stat[z].multiplier * stats.table;
          let index = stats.stat[z].errors.indexOf(result);
          
          if (index != -1) {
            stats.stat[z].errors.splice(index, 1);
          }
          
          stats.stat[z].averageTime = stats.stat[z].averageTime / stats.nb;
          if (stats.stat[z].averageError != 0) {
            stats.stat[z].averageError = stats.stat[z].averageError / stats.nb;
          } 
        }

        //we store the global training statistics
        globalStatistics.statistics.push(stats);
      }
    },
    //find the key of associated value if exist or return false
    getKeyIfValueExistTrain: function(value, array) {
      for (let i=0; i < array.length; i++) {
        if (array[i].table === value) {
            return i;
        }
      }
      return false;
    },
    //find the key of associated with 2 value if they exist, or return false
    getKeyIfValueExistEv: function(value, value2, array) {
      for (let i=0; i < array.length; i++) { 
        if (array[i].multiplier1 === value && array[i].multiplier2 === value2) {
            return i;
        }
      }
      return false;
    },
    //check if a value is present in an array
    valueInArrayExist: function(value, array) {
      for (let i=0; i < array.length; i++) {
        if (array[i] === value) {
            return true;
        }
      }
      return false;
    },
  }
};
