var storeTraining = {
  table : 0,
  round : 0,
	tablesDone : [],
  operations : [],
  userChoices : []
};

var time = {
  start : 0,
  end : 0
};

var storeEvaluation =	{
	trainingDone : false,
	index : 0,
	operations: [],
	currentOperation : 0
};

var storage = {
  storageExist : false,
  saveUri : null,
  message : null
};

var globalStatistics = {
  statistics : [],
  trainExist : false,
  evaluateExist : false,
  displayTrain : false,
  displayEvaluate : false
};