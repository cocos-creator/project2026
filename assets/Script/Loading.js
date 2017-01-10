cc.view.enableAntiAlias(false);

cc.Class({
    extends: cc.Component,

    properties: {
        label: cc.Label,
        interval: 0
    },

    onLoad () {
        this.dotCount = 0;
        this.dotMaxCount = 3;
    },

    // use this for initialization
    startLoading () {
        this.label.enabled = true;
        this.dotCount = 0;
        let size = cc.view.getVisibleSize();
        this.node.setPosition(cc.p(size.width/2 - this.label.node.width/2, size.height/2));
        this.schedule(this.updateLabel, this.interval, this);        
    },

    stopLoading () {
        this.label.enabled = false;
        this.unschedule(this.updateLabel);
        this.node.setPosition(cc.p(2000, 2000));
    },

    updateLabel () {
        let dots = '.'.repeat(this.dotCount);
        this.label.string = 'Loading' + dots;
        this.dotCount += 1;
        if (this.dotCount > this.dotMaxCount) {
            this.dotCount = 0;
        }
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
