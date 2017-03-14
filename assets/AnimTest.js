const Tween = require('TweenLite');
const Timeline = require('TimelineLite');

cc.Class({
    extends: cc.Component,

    properties: {
        attacker: cc.Node,
        defender: cc.Node
    },

    // use this for initialization
    start: function () {
        let origAtkPos = this.attacker.position;
        let origDefPos = this.defender.position;
        let tl = new Timeline();
        tl.add(Tween.to(this.attacker, 1, {
            x: origDefPos.x,
            y: origDefPos.y,
            ease: Back.easeIn
        }));
        tl.add(Tween.to(this.defender, 0.3, {
            x: origDefPos.x + 50,
            ease: Power2.easeOut
        }));
        tl.add([
            Tween.to(this.attacker, 1.2, {
                x: origAtkPos.x,
                y: origAtkPos.y,
                ease: Back.easeIn
            }),
            Tween.to(this.defender, 0.5, {
                x: origDefPos.x,
                ease: Power2.easeOut
            })
        ], 'myLabel', 'start', 0.7);
        tl.play();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
});
