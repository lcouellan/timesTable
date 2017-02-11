const router = new VueRouter({
	routes: [
		{ path: "/", component: home },
		{ path: "/apprentissage", component: learning, name: "learning" },
		{ path: "/evaluation", component: evaluation, name: "evaluation"},
		{ path: "/statistiques", component: statistics, name: "statistics" },
		{ path: "/profils", component: profilManagement, name: "profilManagement" }
	]
});

var app = new Vue(
	{
		el: "#app",
		router: router
	});