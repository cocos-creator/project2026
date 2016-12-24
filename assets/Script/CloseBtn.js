cc.Class({
    extends: cc.Component,

    properties: {
        btnDown: cc.SpriteFrame,
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        let sprite = self.getComponent(cc.Sprite);
        this.backpack = this.node.parent;
        this.node.on(cc.Node.EventType.TOUCH_START, function(event){
            self.btnUp = sprite.spriteFrame;
            sprite.spriteFrame = self.btnDown;
        }, this);
        this.node.on(cc.Node.EventType.TOUCH_END, function(event){
            sprite.spriteFrame = self.btnUp;
            self.backpack.setScale(0, 0);
            self.backpack.active = false;
        }, this);
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
