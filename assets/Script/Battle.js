const CardCount = 4;
const Tween = require('TweenLite');
const Timeline = require('TimelineLite');

var turnFsm = new StateMachine({
    data: {
        battle: null,
    },
    transitions: [
        { name: 'toStart', from: 'none', to: 'start' },
        { name: 'toPlayer', from: 'start', to: 'player' },
        { name: 'playerEnd', from: 'player', to: 'enemy' },
        { name: 'toEnd', from: 'enemy', to: 'end' },
        { name: 'restart', from: 'end', to: 'start' },
    ],
    methods: {
        onStart() {
            setTimeout(() => {
                turnFsm.toPlayer();
            }, 1000);
        },
        onPlayer() {
            setTimeout(() => {
                playerFsm.start();
            }, 1000);
        },
        onEnd() {
            battle.elementPool.gain();
            setTimeout(() => {
                turnFsm.restart();
            }, 1000);
        },
        onEnemy() {
            setTimeout(() => {
                turnFsm.toEnd();
            }, battle.enemyTurnTime * 1000);
        },

        // debug
        onEnterState(lifecycle) {
            battle.turnFsmLabel.string = 'Turn State: ' + lifecycle.to;
        }
    }
});

var playerFsm = new StateMachine({
    transitions: [
        { name: 'start', from: 'none', to: 'drawCards' },
        { name: 'drawCardsFinish', from: 'drawCards', to: 'useCard' },
        { name: 'useCardFinish', from: 'useCard', to: 'attack' },
        { name: 'attackFinish', from: 'attack', to: 'end' },
        { name: 'start', from: 'end', to: 'drawCards' },
    ],
    methods: {
        onDrawCards() {
            for (var i = battle.cards.childrenCount; i < CardCount; i++) {
                var card = cc.instantiate(battle.cardPrefab);
                var randomIndex = (Math.random() * battle.cardDatas.length) | 0;
                var cardData = battle.cardDatas[randomIndex];

                var cardComp = card.getComponent('Card');
                cardComp.init(battle, cardData);
                card.parent = battle.cards;
                card.scale = 0;
            }
            let tl = new Timeline();
            tl.add(battle.cards.children.map(x => {
                return Tween.to(x, 0.4, {
                    scaleX: 1,
                    scaleY: 1
                });
            }), '', 'sequence');
            tl.play();

            setTimeout(() => {
                battle.drawCardsFinish();
            }, 400 * 4);
        },
        onEnterUseCard() {
            var children = battle.cards.children;
            for (var i = 0; i < children.length; ++i) {
                var card = children[i];
                card.getComponent('Card').enabled = true;
            }
        },
        onLeaveUseCard() {
            var children = battle.cards.children;
            for (var i = 0; i < children.length; ++i) {
                var card = children[i];
                card.getComponent('Card').enabled = false;
            }

            let data = battle.playerUsedCard.data;
            battle.playerUsedCard.node.destroy();
            battle.elementPool.cost(data.cost);
        },
        onAttack() {
            setTimeout(() => {
                playerFsm.attackFinish();
            }, 1000);
        },
        onEnd() {
            setTimeout(() => {
                turnFsm.playerEnd();
            }, 1000);
        },

        // debug
        onEnterState(lifecycle) {
            battle.playerFsmLabel.string = 'Player State: ' + lifecycle.to;
        }
    }
});

var battle = null;

cc.Class({
    extends: cc.Component,

    properties: {
        enemyTurnTime: 2,
        cardPrefab: cc.Prefab,
        cards: cc.Node,
        turnFsmLabel: cc.Label,
        playerFsmLabel: cc.Label
    },

    onLoad() {
        battle = this;
        this.elementPool = this.getComponent('ElementPool');
        var dataMng = require('DataMng');
        dataMng.loadCards(() => {
            this.cardDatas = dataMng.cards;
            turnFsm.toStart();
        });
    },

    drawCardsFinish() {
        setTimeout(() => {
            playerFsm.drawCardsFinish();
        }, 1000);
    },

    playerUseCardFinish() {
        playerFsm.useCardFinish();
    }
});

module.exports = {
    turnFsm,
    playerFsm,
};
