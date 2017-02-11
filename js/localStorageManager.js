const LOCAL_STORAGE_NAME = "timesTableGame";
const LOCAL_EVALUATE_COL = "evaluate";
const LOCAL_TRAIN_COL = "train";
const LOCAL_FINISH_COL = "finishedTables";

//create a structured but empty localStorage
function initLocalStorage() {
  let toStore = JSON.stringify({
    [LOCAL_EVALUATE_COL] : [],
    [LOCAL_TRAIN_COL] : [],
	  [LOCAL_FINISH_COL] : []
  });
  localStorage.setItem(LOCAL_STORAGE_NAME, toStore);
}

function destroyStorage() {
  localStorage.removeItem(LOCAL_STORAGE_NAME);
}

//when called this function store the result from the store to local storage
function updateLocalStorage(type, content) {
  if(!localStorageExist()) {
    //we create the localStorage
    initLocalStorage();
  } 
  //we retrieve the data from the local storage
  let storage = JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME));
  //we append the data of the game
  storage[type].push(content);
  //we prepare the data to be send back
  let toStore = JSON.stringify(storage);
  //we push the updated data;
  localStorage.setItem(LOCAL_STORAGE_NAME, toStore);
}

//override the localStorage with a save
function backUpStorageFromSave(save) {
  if(!localStorageExist()) {
    //we create the localStorage
    initLocalStorage();
  }
  localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(save));
}

function getLocalStorage() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME));
}

function localStorageExist() {
  return LOCAL_STORAGE_NAME in localStorage ? true : false;
}

function localStorageEvaluateExist() {
  if (localStorageExist()) {
    let storage = getLocalStorage();
    if (storage[LOCAL_EVALUATE_COL]) {
      return storage[LOCAL_EVALUATE_COL].length > 0 ? true : false;
    }
  }
  return false;
}

function localStorageTrainExist() {
  if (localStorageExist()) {
    let storage = getLocalStorage();
    if (storage[LOCAL_TRAIN_COL]) {
      return storage[LOCAL_TRAIN_COL].length > 0 ? true : false;
    }
  }
  return false;
}
