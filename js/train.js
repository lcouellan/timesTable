var learning = {
  template: "#learning",
  data: function() {
    return store
  },
  methods: {
    //-----------------------------------
    //Game methods call by front listener
    //-----------------------------------
    //init function lauching the game
    play: function(tableNumber) {
      //initGame
      store.round = 0;
      //generate all the operation
      this.compute(tableNumber);
      //set the first round (0+1) and so start it.
      store.round++;
      //start and store the start in seconds
      time.start = new Date().getTime() / 1000;
    },
    //check the user response and alter the game in consequence
    playRound: function(roundNumber, userChoice) {

      //we keep playing unless we have already done 10 turn
      if (roundNumber <= 10){
        store.userChoices.push(userChoice);
        //wrong answer:
        if (userChoice != store.operations[roundNumber-1].result) {
          store.operations[roundNumber-1].error++;
        } else { //right answer
          //we archive userChoices then reset it.
          //we store the stop time in second
          time.stop = new Date().getTime() / 1000;
          //we store the difference between start and stop time.
          store.operations[roundNumber-1].time = Math.round(time.stop - time.start);
          store.operations[roundNumber-1].userChoices = store.userChoices;
          store.userChoices = [];
          store.round++;
          time.start = new Date().getTime() / 1000;
        }
      }
    },
    
    end: function() {
      updateLocalStorage(LOCAL_TRAIN_COL, store);
    },
    //-----------------------------------
    //Game methods call by backend
    //-----------------------------------
    //generate 10 operations form a given table
    compute: function(tableNumber) {
      store.table = tableNumber;

      //we generate and store each operations
      for (m=1; m<=10; m++) {

        //generation of the possible answers
        //needed to avoid compilation error of vueJs
        let choices = [];
        for (c=1; c<=10; c++) {
          choices[c-1] = tableNumber * c;
        }
        //we store the operation
        store.operations[m-1] = {
          multiplier : m,
          result : tableNumber * m,
          choices : this.mix(choices),
          userChoices : [],
          error : 0,
          time : 0
        };
      }
      //we mix the operation
      store.operations = this.mix(store.operations);
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
    }
  },
  
};
