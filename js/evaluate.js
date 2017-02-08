var evaluation =
	{
		template: "#evaluation",
		data: function() {
			return storeEvaluation
		},
		created: function(){
			// Create new multiplication
			storeEvaluation.multiplier1 = Math.floor((Math.random() * 10) + 1);
			storeEvaluation.multiplier2 = Math.floor((Math.random() * 10) + 1);
			storeEvaluation.result = storeEvaluation.multiplier1 * storeEvaluation.multiplier2;
			storeEvaluation.choices = this.generateChoices();
		},
		methods: {
			generateChoices: function(){
				//compute and store operations value
				let choices = [];

				// fill choices with bad answers
				for (let i = 0; i < 3; i++) {
					let choice;
					do {
						choice = this.generateBadChoice();
					} while (choice == storeEvaluation.result || choices.indexOf(choice) >= 0)
					choices.push(choice);
				}

				// add the result to the choices
				choices.push(storeEvaluation.result);

				// Mix the answers
				choices = this.mixChoices(choices);
				return choices;
			},
			generateBadChoice: function () {

				// Create a random number deciding which bad result compute
				let random = Math.floor((Math.random() * 3) + 1);

				let badChoice = 0;
				switch(random) {
					case 1 :

						// Bad choice 1 : Return a number between -5 and +5 of the result
						badChoice = Math.floor((Math.random() * (storeEvaluation.result+5 - storeEvaluation.result-5 + 1)) + storeEvaluation.result-5);
						break;
					case 2 :

						// Bad choice 2 : Return a number in the the same multiplication table of the result
						badChoice = storeEvaluation.multiplier1 * Math.floor((Math.random() * 10) + 1);
						break;
					case 3 :

						// Bad choice 3 : Concatenate the 2 multipliers
						badChoice = storeEvaluation.multiplier1 * 10 + storeEvaluation.multiplier2;
						break;
					case 4 :

						// Bad choice 4 : add the 2 multipliers
						badChoice = storeEvaluation.multiplier1 + storeEvaluation.multiplier2;
						break;
					case 5 :

						// Bad choice 5 : Return the number above in the multiplication table
						badChoice = (storeEvaluation.multiplier1 - 1) * storeEvaluation.multiplier2;
						break;
					case 6 :

						// Bad choice 6 : Return the number below in the multiplication table
						badChoice = (storeEvaluation.multiplier1 + 1) * storeEvaluation.multiplier2;
						break;

				}
				return badChoice;
			},
			mixChoices: function (choices) {
				for (let i = 0; i <= 20; i++) {
					let random = Math.floor((Math.random() * 4));
					let random2 = Math.floor((Math.random() * 4));
					let tmp = choices[random];
					choices[random] = choices[random2];
					choices[random2] = tmp;
				}
				return choices;
			}
		}
	};

