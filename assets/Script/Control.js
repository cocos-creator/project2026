const DataMng = require('DataMng');

cc.Class({
    extends: cc.Component,

    properties: {
        speed: 10
    },

    onLoad: function () {
        // add key down and key up event
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.on(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    
        this.anim = this.getComponent(cc.Animation);
        this.moveDirection = null;
    },

    destroy () {
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_DOWN, this.onKeyDown, this);
        cc.systemEvent.off(cc.SystemEvent.EventType.KEY_UP, this.onKeyUp, this);
    },

    onKeyDown: function (event) {
        switch(event.keyCode) {
            case cc.KEY.left:
                if (event.keyCode !== this.moveDirection) {
                    this.anim.play('move_left');
                }
                break;
            case cc.KEY.right:
                if (event.keyCode !== this.moveDirection) {
                    this.anim.play('move_right');
                }
                break;
            case cc.KEY.up:
                if (event.keyCode !== this.moveDirection) {
                    this.anim.play('move_up');
                }
                break;
            case cc.KEY.down:
                if (event.keyCode !== this.moveDirection) {
                    this.anim.play('move_down');
                }
                break;
        }
        this.moveDirection = event.keyCode;
    },

    onKeyUp: function (event) {
        if (event.keyCode === this.moveDirection) {
            this.moveDirection = null;
            this.anim.stop();
        }
    },

    update: function (dt) {
        switch(this.moveDirection) {
            case cc.KEY.left:
                this.node.x -= this.speed;
                break;
            case cc.KEY.right:
                this.node.x += this.speed;
                break;
            case cc.KEY.up:
                this.node.y += this.speed;
                break;
            case cc.KEY.down:
                this.node.y -= this.speed;
                break;
        }
    }
});