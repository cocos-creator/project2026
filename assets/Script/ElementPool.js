cc.Class({
    extends: cc.Component,

    properties: {
        values: [cc.Integer],
        elements: [cc.Label],
        increments: [cc.Integer],
    },

    // use this for initialization
    onLoad: function () {
        //this.values = [6,6,6,6];
    },

    cost (costs) {
        for (var i = 0; i < costs.length; i++) {
            this.values[i] -= costs[i];
            this.elements[i].string = this.values[i];
        }
    },

    gain () {
        this.cost(this.increments.map(x => -x));
    }
});
