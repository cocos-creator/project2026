const TweenLite = require('TweenLite');
const State = cc.Enum({
    Idle: -1,
    Run: -1,
    Attack: -1,
    Cast: -1,
    Hurt: -1
});

cc.Class({
    extends: cc.Component,

    properties: {
        sprite: cc.Sprite,
        anim: cc.Animation,
        moveDuration: 0,
        attackOffset: 0
        // testTarget: cc.Node
    },

    // use this for initialization
    init (battle) {
        this.battle = battle;
        this.playAnim(State.Idle);
        this.initPos = this.node.position;
        this.initScaleX = this.node.scaleX;
        this.bindedAttackComplete = this.onAttackComplete.bind(this);
    },

    playAnim (state, callback) {//State
        this.anim.play(State[state].toLowerCase());
        if (callback) {
            this.anim.on('finished', callback);            
        }
    },

    attackTarget (target) {
        this.target = target;
        let offsetDir = (target.node.x > this.node.x) ? 1 : -1;
        let targetX = target.node.x - this.attackOffset * offsetDir;
        this.moveTo(cc.p(targetX, target.node.y), this.onMoveOutComplete.bind(this));
    },

    attackMe () {
        this.battle.attack(this);
    },

    moveTo (position, callback) {
        TweenLite.to(this.node, this.moveDuration, {
            x: position.x,
            y: position.y,
            ease: Power2.easeOut,
            onComplete: callback
        });
        this.playAnim(State.Run);
    },

    hurt () {
        this.playAnim(State.Hurt);
    },

    onAttackComplete () {
        this.node.scaleX = -this.initScaleX;
        this.moveTo(this.initPos, this.onMoveBackComplete.bind(this));
        this.anim.off('finished', this.bindedAttackComplete);
    },

    onMoveOutComplete() {
        this.playAnim(State.Attack, this.bindedAttackComplete);
        this.target.hurt();
    },

    onMoveBackComplete() {
        this.node.scaleX = this.initScaleX;
        this.playAnim(State.Idle);
        this.battle.onAttackComplete();
    }

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },

    
});
