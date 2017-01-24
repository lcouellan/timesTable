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
    template: "#learningExercise"
}
var evaluation = 
{ 
    template: "#evaluation"
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