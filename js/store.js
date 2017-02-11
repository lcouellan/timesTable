var storeTraining = {
  table : 0,
  round : 0,
	tablesDone : [],
  operations : [],
  userChoices : [],
  activeUser : null,
};

var time = {
  start : 0,
  end : 0
};

var storeEvaluation =	{
	trainingDone : false,
	index : 0,
	operations: [],
	currentOperation : 0,
  activeUser : null,
};

var storage = {
  storageExist : false,
	error: false,
  saveUri : null,
  message : null,
  activeUser : null,
  allUsers : []
};

var globalStatistics = {
  statistics : [],
  trainExist : false,
  evaluateExist : false,
  displayTrain : false,
  displayEvaluate : false,
  activeUser : null,
};

var profils = {
  family : null,
  activeUser : null,
  allUsers : [],
  message : null
};