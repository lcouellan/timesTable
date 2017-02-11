//Constants of column name
const LOCAL_PROFILS_NAME = "profils";
const LOCAL_PROFIL_NAME = "profil";
const LOCAL_FAMILY_NAME = "family";
const LOCAL_PROFIL_ACTIVE = "lastActiveProfil";
const LOCAL_STORAGE_NAME = "timesTableGame";
const LOCAL_EVALUATE_COL = "evaluate";
const LOCAL_TRAIN_COL = "train";
const LOCAL_FINISH_COL = "finishedTables";

//----------------------------------------------
//----------------------------------------------
//Initialization operation
//----------------------------------------------
//----------------------------------------------

//create a structured but empty localStorage
//----------------------------------------------
function initLocalStorage() {
  let toStore = JSON.stringify({
    [LOCAL_PROFILS_NAME] : [{
      [LOCAL_PROFIL_NAME] : null,
      [LOCAL_EVALUATE_COL] : [],
      [LOCAL_TRAIN_COL] : [],
      [LOCAL_FINISH_COL] : []
    }],
    [LOCAL_FAMILY_NAME] : null,
    [LOCAL_PROFIL_ACTIVE] : null
  });

  localStorage.setItem(LOCAL_STORAGE_NAME, toStore);
}

//create the family and default profile
//----------------------------------------------
function initProfilLocalStorage(family, name) {
  initLocalStorage();

  let storage = getLocalStorage();
  storage[LOCAL_PROFIL_ACTIVE] = name;
  storage[LOCAL_FAMILY_NAME] = family;
  storage[LOCAL_PROFILS_NAME][0][LOCAL_PROFIL_NAME] = name;

  setLocalStorage(storage);
}

//----------------------------------------------
//----------------------------------------------
//C.R.U.D OPERATIONS (on LocalStorage)
//----------------------------------------------
//----------------------------------------------

//----------------------------------------------
//CREATE OPERATIONS
//----------------------------------------------

//create a new profil in the family
//----------------------------------------------
function addProfilToStorage(name) {
  let storage = getLocalStorage();
  storage[LOCAL_PROFILS_NAME].push({
    [LOCAL_PROFIL_NAME] : name,
    [LOCAL_EVALUATE_COL] : [],
    [LOCAL_TRAIN_COL] : [],
    [LOCAL_FINISH_COL] : []
  });
  storage[LOCAL_PROFIL_ACTIVE] = name;

  setLocalStorage(storage);
}

//----------------------------------------------
//READ OPERATIONS
//----------------------------------------------

//Return the index of the active profil
//----------------------------------------------
function getActiveProfilIndex(storage) {
  if (storage[LOCAL_PROFILS_NAME].length === 1) {
    return 0;
  }
  for (let i=0; i < storage.length; i++) {
    if (storage[LOCAL_PROFILS_NAME][i][LOCAL_PROFIL_NAME] === storage[LOCAL_PROFIL_ACTIVE]) {
      return i;
    }
  }
}

//Return familyName
//----------------------------------------------
function getFamilyName() {
  return getLocalStorage()[LOCAL_FAMILY_NAME];
}

//Return name of the active user
//----------------------------------------------
function getActiveUserName() {
  return getLocalStorage()[LOCAL_PROFIL_ACTIVE];
}

//Return the list of the users
//----------------------------------------------
function getUsersName() {
  let storage = getLocalStorage();
  let users = [];
  for (let i=0; i < storage[LOCAL_PROFILS_NAME].length; i++) {
    users.push(storage[LOCAL_PROFILS_NAME][i][LOCAL_PROFIL_NAME]);
  }
  return users;
}

//Check if a username already exist
//----------------------------------------------
function checkIfUserExist(user) {
  let users = getUsersName();
  for (let i=0; i < users.length; i++) {
    if(users[i] == user) {
      return true;
    }
  }
  return false;
}

//Return the full local storage (with all users)
//----------------------------------------------
function getLocalStorage() {
  return JSON.parse(localStorage.getItem(LOCAL_STORAGE_NAME));
}

//Return the local storage of the active user
//----------------------------------------------
function getUserActiveLocalStorage() {
  let storage = getLocalStorage();
  let profilIndex = getActiveProfilIndex(storage);
  return storage[LOCAL_PROFILS_NAME][profilIndex];
}

//Check if localStorage exist
//----------------------------------------------
function localStorageExist() {
  return LOCAL_STORAGE_NAME in localStorage ? true : false;
}

//Check if the storage have an unempty evaluate column
//----------------------------------------------
function localStorageEvaluateExist() {
  if (localStorageExist()) {
    let storage = getUserActiveLocalStorage();
    if (storage[LOCAL_EVALUATE_COL]) {
      return storage[LOCAL_EVALUATE_COL].length > 0 ? true : false;
    }
  }
  return false;
}

//Check if the storage have an unempty train column
//----------------------------------------------
function localStorageTrainExist() {
  if (localStorageExist()) {
    let storage = getUserActiveLocalStorage();
    if (storage[LOCAL_TRAIN_COL]) {
      return storage[LOCAL_TRAIN_COL].length > 0 ? true : false;
    }
  }
  return false;
}

//----------------------------------------------
//UPDATE OPERATIONS
//----------------------------------------------

//Set the active profil (the one who play)
//----------------------------------------------
function setActiveProfil(name) {
  let storage = getLocalStorage();
  storage[LOCAL_PROFIL_ACTIVE] = name;
  setLocalStorage(storage);
}

//update game value for the active profile
//----------------------------------------------
function updateLocalStorage(type, content) {
  if(!localStorageExist()) {
    //we create the localStorage
    initLocalStorage();
  } 
  //we retrieve the data from the local storage
  let storage = getLocalStorage();
  let profilIndex = getActiveProfilIndex(storage);
  //we append the data of the game to the last active profile
  storage[LOCAL_PROFILS_NAME][profilIndex][type].push(content);
  //we push the updated data;
  setLocalStorage(storage);
}

//override/create the localStorage from a save
//----------------------------------------------
function backUpStorageFromSave(save) {
  if(!localStorageExist()) {
    //we create the localStorage
    initLocalStorage();
  }
  localStorage.setItem(LOCAL_STORAGE_NAME, JSON.stringify(save));
}

//"push" an object to the localStorage (override it)
//----------------------------------------------
function setLocalStorage(storage) {
  //we prepare the data to be send back
  let toStore = JSON.stringify(storage);
  //we push the updated data;
  localStorage.setItem(LOCAL_STORAGE_NAME, toStore);
}

//----------------------------------------------
//DELETE OPERATIONS
//----------------------------------------------

//Wipe everythings from the localStorage
//----------------------------------------------
function destroyStorage() {
  localStorage.removeItem(LOCAL_STORAGE_NAME);
}
