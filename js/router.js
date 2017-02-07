var router = new VueRouter({
    routes: [
        { path: "/", component: home },
        { path: "/apprentissage", component: learning, name: "learning" },
        { path: "/evaluation", component: evaluation, name: "evaluation" }
    ]
});

var app = new Vue(
{
    el: "#app",
    router: router
});