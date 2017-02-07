var store = 
{
    multiplying1 : 1,
    multiplying2 : 2,
    result : 2
}

var home = 
{ 
    template: "#home"
};
var learning = 
{ 
    template: "#learning"
};
var learningExercise = 
{
    template: "#learningExercise",
    data: function() {
        return store
    },
    created: function(){
        this.charger();
    },
    methods: {
        charger: function(){
            let choice = Math.floor((Math.random() * 2) + 1);
            if (choice == 1) {
                store.multiplying1 = this.$route.params.id;
                store.multiplying2 = Math.floor((Math.random() * 9) + 1);
            } else { 
                store.multiplying1 = Math.floor((Math.random() * 9) + 1);
                store.multiplying2 = this.$route.params.id;
            }
            store.result = store.multiplying1 * store.multiplying2;
        }
    }
};
var evaluation = 
{ 
    template: "#evaluation",
    data: function() {
        return store
    },
    created: function(){
        this.charger();
    },
    methods: {
        charger: function(){
            store.multiplying1 = Math.floor((Math.random() * 9) + 1);
            store.multiplying2 = Math.floor((Math.random() * 9) + 1);
            store.result = store.multiplying1 * store.multiplying2;
        }
    }
};

var router = new VueRouter({
    routes: [
        { path: "/", component: home },
        { path: "/apprentissage", component: learning, name: "learning" },
        { path: "/apprentissageExercice/:id", component: learningExercise, name: "learningExercise" },
        { path: "/evaluation", component: evaluation, name: "evaluation" }
    ]
});

var app = new Vue(
{
    el: "#app",
    router: router
});