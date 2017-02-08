var evaluation =
	{
		template: "#evaluation",
		data: function() {
			return storeEvaluation
		},
		created: function(){

			// Create new multiplication
			for (let i = 0; i < 10; i++) {
				let operation = {
					multiplier1 : 0,
					multiplier2 : 0,
					result : 0,
					choices : [],
					errors : 0,
					userChoices : [],
					time : 0
				};
				operation.multiplier1 = Math.floor((Math.random() * 10) + 1);
				operation.multiplier2 = Math.floor((Math.random() * 10) + 1);
				operation.result = operation.multiplier1 * operation.multiplier2;
				operation.choices = this.generateChoices(operation);
				storeEvaluation.operations.push(operation);
			}
			storeEvaluation.currentOperation = storeEvaluation.operations[storeEvaluation.index];
		},
		methods: {
			generateChoices: function(operation){
				//compute and store operations value
				let choices = [];

				// fill choices with bad answers
				for (let i = 0; i < 3; i++) {
					let choice;
					do {
						choice = this.generateBadChoice(operation);
					} while (choice == operation.result || choices.indexOf(choice) >= 0 || choice < 0)
					choices.push(choice);
				}

				// add the result to the choices
				choices.push(operation.result);

				// Mix the answers
				choices = this.mixChoices(choices);
				return choices;
			},
			generateBadChoice: function (operation) {

				// Create a random number deciding which bad result compute
				let random = Math.floor((Math.random() * 3) + 1);

				let badChoice = 0;
				switch(random) {
					case 1 :

						// Bad choice 1 : Return a number between -5 and +5 of the result
						badChoice = Math.floor((Math.random() * (operation.result + 5 - operation.result - 5 + 1)) + operation.result - 5);
						break;
					case 2 :

						// Bad choice 2 : Return a number in the the same multiplication table of the result
						badChoice = operation.multiplier1 * Math.floor((Math.random() * 10) + 1);
						break;
					case 3 :

						// Bad choice 3 : Concatenate the 2 multipliers
						badChoice = operation.multiplier1 * 10 + operation.multiplier2;
						break;
					case 4 :

						// Bad choice 4 : add the 2 multipliers
						badChoice = operation.multiplier1 + operation.multiplier2;
						break;
					case 5 :

						// Bad choice 5 : Return the number above in the multiplication table
						badChoice = (operation.multiplier1 - 1) * operation.multiplier2;
						break;
					case 6 :

						// Bad choice 6 : Return the number below in the multiplication table
						badChoice = (operation.multiplier1 + 1) * operation.multiplier2;
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
			},
			checkResult : function (choice) {
				storeEvaluation.operations[storeEvaluation.index].userChoices.push(choice);
				if(choice != storeEvaluation.operations[storeEvaluation.index].result) {
					storeEvaluation.operations[storeEvaluation.index].errors++;
				} else {
					this.nextOperation();
				}
			},
			nextOperation: function () {
				if (storeEvaluation.index != storeEvaluation.operations.length - 1) {
					storeEvaluation.currentOperation = storeEvaluation.operations[++storeEvaluation.index];
				} else {
					storeEvaluation.currentOperation = 0;
				}
			}
		}
	};

