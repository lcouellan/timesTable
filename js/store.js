const LOCAL_STORAGE_NAME = "timesTableGame";
const LOCAL_EVALUATE_COL = "evaluate";
const LOCAL_TRAIN_COL = "train";

var store = 
{
  table : 0,
  round : 0,
  //operations:
  /* - multiplier <int>
     - choices []
     - result <int>
     - error <int>
     - time <long>
  */
  operations : [],
  userChoices : []
};

var storeEvaluation =
	{
		index : 0,
		operations: [],
		currentOperation : 0
	}
