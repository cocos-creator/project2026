const CardCount = 4;
const BattlePlayer = require('BattlePlayer');
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
            }, 100);
        },
        onPlayer() {
            setTimeout(() => {
                playerFsm.start();
            }, 100);
        },
        onEnd() {
            battle.elementPool.gain();
            setTimeout(() => {
                turnFsm.restart();
            }, 100);
        },
        onEnemy() {
            battle.attackAPlayer();
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
            battle.setSelectEnemy(true);
            // battle.attacker.attackTarget(battle.defender);
        },
        onEnd() {
            setTimeout(() => {
                turnFsm.playerEnd();
            }, 100);
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
        cardPrefab: cc.Prefab,
        cards: cc.Node,
        turnFsmLabel: cc.Label,
        playerFsmLabel: cc.Label,
        playerLoc: [cc.Node],
        enemyLoc: [cc.Node],
        playerPrefab: cc.Prefab,
    },

    onLoad() {
        battle = this;
        this.elementPool = this.getComponent('ElementPool');
        var dataMng = require('DataMng');
        dataMng.loadCards(() => {
            this.cardDatas = dataMng.cards;
            turnFsm.toStart();
        });
        this.attackerIdx = 0;        
        this.enemyIdx = 0;        
        this.players = [];
        this.enemies = [];
        this.initPlayers();
    },

    initPlayers () {
        for (let i = 0; i < this.playerLoc.length; ++i) {
            let player = cc.instantiate(this.playerPrefab).getComponent(BattlePlayer);
            this.players.push(player);
            this.playerLoc[i].parent.addChild(player.node);
            player.node.position = this.playerLoc[i].position;
            player.init(this);
        }
        for (let i = 0; i < this.enemyLoc.length; ++i) {
            let enemy = cc.instantiate(this.playerPrefab).getComponent(BattlePlayer);
            enemy.node.scaleX = -1;
            this.enemies.push(enemy);
            this.enemyLoc[i].parent.addChild(enemy.node);
            enemy.node.position = this.enemyLoc[i].position;
            enemy.init(this);
        }
    },

    drawCardsFinish() {
        setTimeout(() => {
            playerFsm.drawCardsFinish();
        }, 1000);
    },

    playerUseCardFinish() {
        playerFsm.useCardFinish();
    },

    onAttackComplete () {
        if (this.playerAttacking) {
            playerFsm.attackFinish();
        }
        else {
            turnFsm.toEnd();
        }
    },

    setSelectEnemy (on) {
        for (let i = 0; i < this.enemies.length; ++i) {
            var enemy = this.enemies[i];
            var btn = enemy.getComponentInChildren(cc.Button);
            btn.enabled = on;
        }
    },

    attack (target) {
        this.playerAttacking = this.enemies.indexOf(target) >= 0;
        if (this.playerAttacking) {
            this.players[this.attackerIdx].attackTarget(target);
            ++this.attackerIdx;
            this.attackerIdx = this.attackerIdx % this.players.length;
            this.setSelectEnemy(false);
        }
        else {
            this.enemies[this.enemyIdx].attackTarget(target);
            ++this.enemyIdx;
            this.enemyIdx = this.enemyIdx % this.enemies.length;
        }
    },

    attackAPlayer () {
        var idx = Math.floor(Math.random() * this.players.length);
        var player = this.players[idx];
        this.attack(player);
    }
});

module.exports = {
    turnFsm,
    playerFsm,
};
