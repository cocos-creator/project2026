
/**
 *  背包图标组件 
 * 
 *  控制背包打开关闭
 */

cc.Class({
    extends: cc.Component,

    properties: {
        backpack: cc.Node,
    },

    // use this for initialization
    onLoad: function () {
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEnded, this);
        
    },

    onEnded(event){
        if(this.backpack.active){
            this.backpack.active = false;
        }
        else{
            this.backpack.active = true;
            this.backpack.runAction(cc.scaleTo(0.2, 1));
        }
    },
    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
