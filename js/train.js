var learning = { 
  template: "#learning",
  data: function() {
    return store
  },
  methods: {
    compute: function(tableNumber){
      //compute and store operations value
      let multiplier = Math.floor((Math.random() * 10) + 1);
      let result = tableNumber * multiplier;
      store.exerciseId = tableNumber;
      store.multiplier = multiplier;
      store.result = result;

      //generate user bad choices
        //random +-5 of result
      let choice1;
      do {
        choice1 = Math.floor((Math.random() * (result+5 - result-5 + 1)) + result-5);
      } while(choice1 == result);
        //same table but random multiplier
      let choice2;
      do {
        choice2 = tableNumber * Math.floor((Math.random() * 10) + 1);
      } while(choice2 == result && choice2 == choice1);

        //concatenate tableNumber and multiplier
      let choice3 = tableNumber*10 + multiplier;

      //store and mix user choices
      let choices = [result, choice1, choice2, choice3];
      for (i=0; i<=20; i++) {
        let random = Math.floor((Math.random() * 4));
        let random2 = Math.floor((Math.random() * 4));
        let tmp = choices[random];
        choices[random] = choices[random2];
        choices[random2] = tmp;
      }
      store.choices = choices;
    }
  }
};
