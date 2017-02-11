var home = { 
  template: "#home",
  data: function() {
    return storage
  },
  created: function () {
   //destroyStorage(); //for testing the import of save
    if (LOCAL_STORAGE_NAME in localStorage) {
      storage.storageExist = true;
      this.generateSaveHtmlLink();
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
          if (save[LOCAL_EVALUATE_COL] && save[LOCAL_TRAIN_COL]) {
            //we store the save in the localStorage
            backUpStorageFromSave(save);
            storage.message = "Ta sauvegarde a bien été importée!";
          } else {
            storage.message = "Ta sauvegarde n'a pas été importée, es-tu sûr d'avoir choisi le bon fichier?";
          }
        });
      } else {
        storage.message = "Ta sauvegarde n'a pas été importée, es-tu sûr d'avoir choisi le bon fichier?";
      }
    },
    //async method using a FileReader to get content and return it with callback
    readFile: function(file, onLoadCallback) {
      var reader = new FileReader();
      reader.onload = onLoadCallback;
      reader.readAsText(file);
    }
  }
};