cc.Class({
    extends: cc.Component,

    properties: {
        hero: cc.Node,  // 英雄节点
        speed: 5,       // 速度
    },

    // use this for initialization
    onLoad: function () {
        // 获取动画组件
        this.anim = this.hero.getComponent(cc.Animation);
        // 移动方向
        this.moveDirection = null;

        // 触摸事件注册
        this.node.on(cc.Node.EventType.TOUCH_START, this.onStart, this);
        this.node.on(cc.Node.EventType.TOUCH_END, this.onEnded, this);
        this.node.on(cc.Node.EventType.TOUCH_CANCEL, this.onEnded, this)
    },

    // TOUCH_START事件回调
    onStart: function(event){
        // 获取发生事件的对象
        let target = event.getCurrentTarget();
        // 判断是谁发生了事件
        switch(target.name) {
            case 'left':
                // target.name === this.moveDirection时
                // 说明已经动画已经放过了
                // 防止重复播放
                if (target.name !== this.moveDirection) {
                    this.anim.play('move_left');
                }
                break;
            case 'right':
                if (target.name !== this.moveDirection) {
                    this.anim.play('move_right');
                }
                break;
            case 'up':
                if (target.name !== this.moveDirection) {
                    this.anim.play('move_up');
                }
                break;
            case 'down':
                if (target.name !== this.moveDirection) {
                    this.anim.play('move_down');
                }
                break;
        }
        // 把移动方向存起来
        this.moveDirection = target.name;
    },

    // TOUCH_END和TOUCH_CANCEL事件回调
    onEnded: function(event){
        let target = event.getCurrentTarget();
        if(this.moveDirection === target.name){
            this.moveDirection = null;
        }
    },

    // called every frame, uncomment this function to activate update callback
    update: function (dt) {

        switch(this.moveDirection){
            case 'up':
                this.hero.y += this.speed;
                break; 
            case 'down':
                this.hero.y -= this.speed;
                break; 
            case 'left':
                this.hero.x -= this.speed;
                break; 
            case 'right':
                this.hero.x += this.speed;
                break; 
        }
    },
});
