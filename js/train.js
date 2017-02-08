var learning = {
  template: "#learning",
  data: function() {
    return store
  },
  methods: {
    compute: function(tableNumber) {
      let data = {
        table : 0,
        operations : []
      };
      
      //generation of the possible answers
      data.table = tableNumber;
      let choices = [];
      for (c=1; c<=10; c++) {
        choices[c-1] = tableNumber * c;
      }

      //generation of the 10 operations
      for (m=1; m<=10; m++) {
        let operations = {
          multiplier : 0,
          result : 0,
          choices : [],
          error : 0,
          time : 0
        };

        //we mix the possible answers
        for (i=0; i<=choices.length; i++) {
          let random = Math.floor((Math.random() * (data.operations.length-1)));
          let random2 = Math.floor((Math.random() * (data.operations.length-1)));

          let tmp = choices[random];
          choices[random] = choices[random2];
          choices[random2] = tmp;
        }

        //we store the value for each operations
        operations.multiplier = m;
        operations.result = tableNumber * m;
        data.operations[m-1] = operations;
        operations.choices = choices;
      }

      //we mix the 10 operations:
      for (i=0; i<=Math.pow(data.operations.length,2); i++) {
        let random = Math.floor((Math.random() * (data.operations.length-1)));
        let random2 = Math.floor((Math.random() * (data.operations.length-1)));

        let tmp = data.operations[random];
        data.operations[random] = data.operations[random2];
        data.operations[random2] = tmp;
      }
      
      //Then we store the computation
      store.table = data;
    }
  },
  play: function() {

  },
  timer: function() {

  }
};
