cc.Class({
    extends: cc.Component,

    properties: {
        title: cc.Label,
        desc: cc.Label,
        costs: [cc.Label]
    },

    onEnable: function () {
        this.node.on('touchstart', this.use, this);
    },
    onDisable: function () {
        this.node.off('touchstart', this.use, this);
    },

    init (battle, data) {
        this.battle = battle;
        
        this.title.string = data.name;
        this.desc.string = data.desc;
        for (var i = 0; i < data.cost.length; i++) {
            this.costs[i].string = data.cost[i];
        }

        this.data = data;
    },

    use () {
        this.battle.playerUsedCard = this;
        this.battle.playerUseCardFinish();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
