var home = { 
  template: "#home",
  data: function() {
    return storage
  },
  created: function () {
    if (localStorageExist()) {
      storage.storageExist = true;
      this.generateSaveHtmlLink();
      storage.activeUser = getActiveUserName();
      storage.allUsers = getUsersName();
    }
  },
  methods: {
    //we parse the localStorage in URI (the user can download it but we don't have to generate the file in the server)
    generateSaveHtmlLink: function () {
      let saveJson = encodeURIComponent(JSON.stringify(getLocalStorage()));
      let saveUri = "data:text/json;charset=utf-8,"+saveJson;

      storage.saveUri = saveUri;
    },
    //import method (we get the file when the user add it in the input without storing the file in the server)
    importSave: function (event) {
      //we get the file from the FileList (DOM File API)
      let file = event.target.files[0];
      //we check if the file have the good ext
      if (event.target.files[0].name.split(".")[1] == "save") {
        //we call the async method readFile to get the content as text
        this.readFile(file, function(e) {
          let content = e.target.result;
          let save = JSON.parse(content);
          //we check if the object is properly build
          if (save[LOCAL_PROFILS_NAME] && save[LOCAL_PROFIL_ACTIVE]) {
            //we store the save in the localStorage
            backUpStorageFromSave(save);
            storage.message = "Ta sauvegarde a bien été importée!";
            storage.error = false;
            storage.activeUser = getActiveUserName();
            storage.allUsers = getUsersName();
            storage.storageExist = true;
          } else {
            storage.message = "Ta sauvegarde n'a pas été importée, es-tu sûr d'avoir choisi le bon fichier?";
            storage.error = true;
            storage.storageExist = false;
          }
        });
      } else {
        storage.message = "Ta sauvegarde n'a pas été importée, es-tu sûr d'avoir choisi le bon fichier?";
        storage.error = true;
        storage.storageExist = false;
      }
    },
    //async method using a FileReader to get content and return it with callback
    readFile: function(file, onLoadCallback) {
      var reader = new FileReader();
      reader.onload = onLoadCallback;
      reader.readAsText(file);
    },
    //method use for create a new family and the default user
    createFamily: function(event) {
      let firstName = event.target[0].value;
      let lastName = event.target[1].value;

      if (firstName && lastName) {
        initProfilLocalStorage(lastName, firstName);
        storage.message = "Ton profil et famille ont bien été créés!";
        storage.storageExist = true;
        storage.activeUser = firstName;
        storage.allUsers = getUsersName;
      } else {
        storage.message = "Tu dois indiquer ton nom et ton prénom!";
      }
    },
    //method use for changing the active user when there is multiple profil
    changeActiveUser: function(user) {
      setActiveProfil(user);
      storage.activeUser = user;
    },
    //method use for wipe all data
    wipeAllData: function() {
      destroyStorage();
      storage.message = "Données correctement supprimées";
      storage.storageExist = false;
      storage.activeUser = null;
      storage.allUsers = null;
    }
  }
};
