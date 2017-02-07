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

