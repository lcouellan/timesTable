var learning = {
  template: "#learning",
  data: function() {
    return storeTraining
  },
	created: function () {
		storeTraining.tablesDone = this.getTablesDone();
	},
  methods: {
    //-----------------------------------
    //Game methods call by front listener
    //-----------------------------------
    //init function lauching the game
    play: function(tableNumber) {
      //initGame
      storeTraining.round = 0;
      //generate all the operation
      this.compute(tableNumber);
      //set the first round (0+1) and so start it.
      storeTraining.round++;
      //start and store the start in seconds
      time.start = new Date().getTime() / 1000;
    },
    //check the user response and alter the game in consequence
    playRound: function(roundNumber, userChoice) {

      //we keep playing unless we have already done 10 turn
      if (roundNumber <= storeTraining.operations.length){
        storeTraining.userChoices.push(userChoice);
        //wrong answer:
        if (userChoice != storeTraining.operations[roundNumber-1].result) {
          storeTraining.operations[roundNumber-1].error++;
        } else { //right answer
          //we archive userChoices then reset it.
          //we store the stop time in second
          time.stop = new Date().getTime() / 1000;
          //we store the difference between start and stop time.
          storeTraining.operations[roundNumber-1].time = Math.round(time.stop - time.start);
          storeTraining.operations[roundNumber-1].userChoices = storeTraining.userChoices;
          storeTraining.userChoices = [];
          storeTraining.round++;
          time.start = new Date().getTime() / 1000;
        }
      }
    },
    
    end: function() {
      this.userFinishExercise();
	    updateLocalStorage(LOCAL_TRAIN_COL, storeTraining);
    },
    //-----------------------------------
    //Game methods call by backend
    //-----------------------------------
    //generate 10 operations form a given table
    compute: function(tableNumber) {
      storeTraining.table = tableNumber;

      //we generate and store each operations
      for (m=1; m<=10; m++) {

        //generation of the possible answers
        //needed to avoid compilation error of vueJs
        let choices = [];
        for (c=1; c<=10; c++) {
          choices[c-1] = tableNumber * c;
        }
        //we store the operation
        storeTraining.operations[m-1] = {
          multiplier : m,
          result : tableNumber * m,
          choices : this.mix(choices),
          userChoices : [],
          error : 0,
          time : 0
        };
      }
      //we mix the operation
      storeTraining.operations = this.mix(storeTraining.operations);
    },
    //-----------------------------------
    //Generic methods (tools)
    //-----------------------------------
    //mix an array by doing size² permutation in it.
    mix: function(array) {
      for (i=0; i<=array.length*array.length; i++) {
        let random = Math.floor((Math.random() * (array.length)));
        let random2 = Math.floor((Math.random() * (array.length)));
        let tmp = array[random];
        array[random] = array[random2];
        array[random2] = tmp;
      }
      return array;
    },
	  userFinishExercise: function () {
		  if(!localStorageExist()) {
			  //we create the localStorage
			  initLocalStorage();
		  }
		  let exercicesDone = getLocalStorage().train;
		  let done = false;
		  for(let i = 0; i < exercicesDone.length; i++) {
			  if ( storeTraining.table == exercicesDone[i].table) {
				  done = true;
			  }
		  }
		  if (done == false) {
			  updateLocalStorage(LOCAL_FINISH_COL, storeTraining.table);
		  }
	  },
	  getTablesDone: function () {
		  if(!localStorageExist()) {
			  //we create the localStorage
			  initLocalStorage();
		  }
		  return getLocalStorage().finishedTables;
	  },
	  isDone: function (tableNumber) {
		  return storeTraining.tablesDone.includes(tableNumber);
	  }
  }
};
