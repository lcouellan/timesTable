var profilManagement = { 
  template: "#profilManagement",
  data: function() {
    return profils
  },
  created: function () {
    if (localStorageExist()) {
      profils.activeUser = getActiveUserName();
      profils.allUsers = getUsersName();
      profils.family = getFamilyName();
    }
  },
  methods: {
    addActiveUser: function(event) {
      let name = event.target[0].value;

      if (name) {
        if (!checkIfUserExist(name)) {
          addProfilToStorage(name);
          storage.storageExist = true;
          profils.activeUser = name;
          profils.allUsers = getUsersName();
          profils.message = "Le profil " + name + " a bien été créé!";
        } else { //l'utilisateur existe déjà
          profils.message = "Le profil " + name + " existe déjà.";
        }
      } else { //pas de saisie
        profils.message = "Vous devez saisir un prénom.";
      }
    },
    deleteUser: function(name) {
      if (getUsersName().length > 1) {
        deleteProfil(name);
        profils.activeUser = getActiveUserName();
        profils.allUsers = getUsersName();
        profils.message = "Le profil " + name + " a bien été supprimé!";
      } else {
        profils.message = "Si vous souhaitez supprimer le dernier profil veuillez utiliser Supprimer toutes les données ci-dessous";
      }
    }
  }
};
