var evaluation =
	{
		template: "#evaluation",
		data: function() {
			return storeEvaluation
		},
		created: function(){
			this.init();
			if (localStorageExist()) {
				storeEvaluation.activeUser = getActiveUserName();
				storeEvaluation.operations = [];
				
				let exercisesDone = getUserActiveLocalStorage().finishedTables.length;

				if (exercisesDone == 10)
				{
					storeEvaluation.trainingDone = true;
					// Create 10 multiplications for Evaluation Mode
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

						// Save operation

						// We reduce the probability of getting operator 1 or 10 (because they are easy) of 75% randomly
						if (Math.floor((Math.random() * 2)) == 0) {
							operation.multiplier1 = this.randomWithRange(2, 9);
							operation.multiplier2 = this.randomWithRange(2, 9);
						} else {
							if (Math.floor((Math.random() * 2)) == 0) {
								operation.multiplier1 = this.randomWithRange(1, 10);
								operation.multiplier2 = this.randomWithRange(2, 9);
							} else {
								operation.multiplier1 = this.randomWithRange(2, 9);
								operation.multiplier2 = this.randomWithRange(1, 10);
							}
						}
						
						operation.result = operation.multiplier1 * operation.multiplier2;
						operation.choices = this.generateChoices(operation);
						storeEvaluation.operations.push(operation);
					}

					// Get the current operation
					storeEvaluation.currentOperation = storeEvaluation.operations[storeEvaluation.index];
					//start and store the start in seconds
					time.start = new Date().getTime() / 1000;
				}
			}
		},
		methods: {
			init : function () {
				if (localStorageExist()) {
					storeEvaluation.activeUser = getActiveUserName();
					storeEvaluation.operations = [];
					storeEvaluation.index = 0;

					let exercisesDone = getUserActiveLocalStorage().finishedTables.length;

					if (exercisesDone == 10)
					{
						storeEvaluation.trainingDone = true;
						// Create 10 multiplications for Evaluation Mode
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

							// Save operation
							operation.multiplier1 = Math.floor((Math.random() * 10) + 1);
							operation.multiplier2 = Math.floor((Math.random() * 10) + 1);
							operation.result = operation.multiplier1 * operation.multiplier2;
							operation.choices = this.generateChoices(operation);
							storeEvaluation.operations.push(operation);
						}

						// Get the current operation
						storeEvaluation.currentOperation = storeEvaluation.operations[storeEvaluation.index];
						//start and store the start in seconds
						time.start = new Date().getTime() / 1000;
					}
				}
			},
			generateChoices: function(operation){

				//compute and store operations value
				let choices = [];

				// fill choices with bad answers
				for (let i = 0; i < 3; i++) {
					let choice;
					do {
						choice = this.generateBadChoice(operation);
					} while (choice == operation.result || choices.indexOf(choice) >= 0 || choice <= 0)
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
				// where min is the first case statement
				// where max is the last case statement
				let random = this.randomWithRange(1, 6);

				let badChoice = 0;
				switch(random) {
					case 1 :

						// Bad choice 1 : Return a number between -5 and +5 of the result
						badChoice = this.randomWithRange(operation.result - 5, operation.result + 5);
						break;
					case 2 :

						// Bad choice 2 : Return a number in the the same multiplication table of the result
						badChoice = operation.multiplier1 * this.randomWithRange(1, 10);
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

			// Mix answers for an operation
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

			// Check result when user click
			checkResult : function (choice) {
				storeEvaluation.currentOperation.userChoices.push(choice);

				// If bad choice
				if(choice != storeEvaluation.currentOperation.result) {
					storeEvaluation.currentOperation.errors++;
				} else {
					//we store the stop time in second
          			time.stop = new Date().getTime() / 1000;
          			//we store the difference between start and stop time.
          			storeEvaluation.operations[storeEvaluation.index].time = Math.round(time.stop - time.start);
					this.nextOperation();
				}
			},

			// If response is correct go to the next operation
			nextOperation: function () {
				// Check there is more operations
				if (storeEvaluation.index != storeEvaluation.operations.length - 1) {
					storeEvaluation.operations[storeEvaluation.index] = storeEvaluation.currentOperation;
					if ( storeEvaluation.currentOperation.errors > 1 || storeEvaluation.currentOperation.time > 15) {
						this.setOperationWithProblem();
					}
					storeEvaluation.currentOperation = storeEvaluation.operations[++storeEvaluation.index];
					time.start = new Date().getTime() / 1000;
				} else {
					storeEvaluation.index ++;
					storeEvaluation.currentOperation = 0;
					//end of the game, we update the local storage
					updateLocalStorage(LOCAL_EVALUATE_COL, storeEvaluation);
				}
			},
			setOperationWithProblem() {
				//we add the operation only if there is at least 2 turn left
				if (storeEvaluation.index + 2 < storeEvaluation.operations.length) {
					let min = storeEvaluation.index + 2; //we don't want the operation to reapear just next to this one.
					let max = storeEvaluation.operations.length-1; //we need an index
					let place = this.randomWithRange(min, max);

					let operationWithProblem = {
						multiplier1 : storeEvaluation.currentOperation.multiplier1,
						multiplier2 : storeEvaluation.currentOperation.multiplier2,
						result : storeEvaluation.currentOperation.result,
						time: 0,
						errors: 0,
						userChoices: [],
						choices: this.generateChoices(storeEvaluation.currentOperation)
					};
					storeEvaluation.operations[place] = operationWithProblem;
				}
			},
			randomWithRange(min, max) {
				return Math.floor((Math.random() * (max - min + 1) + min));
			}
		}
	};

