var learning = {
  template: "#learning",
  data: function() {
    return store
  },
  methods: {
    //-----------------------------------
    //Game methods call by front listener
    //-----------------------------------
    play: function(tableNumber) {
      this.compute(tableNumber);
      store.round++;
    },
    playRound: function(roundNumber, userChoice) {
      //we keep playing unless we have already done 10 turn
      if (roundNumber <= 10){
        store.operations[roundNumber-1].userChoices.push(userChoice);
        //wrong answer:
        if (userChoice != store.operations[roundNumber-1].result) {
          store.operations[roundNumber-1].error++;
        } else { //right answer
          store.round++;
        }
      } else { //end of the game
        this.end();
      } 
    },
    //-----------------------------------
    //Game methods call by backend
    //-----------------------------------
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

        // operations[m-1] = operation;
        store.operations[m-1] = {
          multiplier : m,
          result : tableNumber * m,
          choices : this.mix(choices),
          userChoices : [],
          error : 0,
          time : 0
        };
      }

      store.operations = this.mix(store.operations);

      },
    // end: function() {

    // },
    //-----------------------------------
    //Generic methods (tools)
    //-----------------------------------
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
    // timer: function(e) {

    // }
  },
  
};
