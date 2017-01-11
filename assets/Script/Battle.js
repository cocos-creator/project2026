const CardCount = 4;

cc.Class({
    extends: cc.Component,

    properties: {
        enemyTurnTime: 2,
        cardPrefab: cc.Prefab,
        cards: cc.Node,
    },

    onLoad () {
        this.elementPool = this.getComponent('ElementPool');
        var dataMng = require('DataMng');
        dataMng.loadCards(() => {
            this.cardDatas = dataMng.cards;
            this.startTurn();
        });
    },

    startTurn (callback) {
        cc.log('startTurn');
        async.waterfall([
            this.playerTurn.bind(this),
            this.enemyTurn.bind(this),
            this.endTurn.bind(this),
        ], this.startTurn.bind(this));
    },

    endTurn (callback) {
        this.elementPool.gain();
        callback();
    },

    playerTurn (callback) {
        cc.log('playerTurn');
        async.waterfall([
            this.drawCards.bind(this),
            this.playerUseCard.bind(this),
            this.playerAttack.bind(this)
        ], callback);
    },

    playerUseCard (callback) {
        cc.log('playerUseCard');
        this.playerUseCardCallback = () => {
            let data = this.playerUsedCard.data;
            this.playerUsedCard.node.destroy();
            this.elementPool.cost(data.cost);
            callback();
        };
    },

    playerAttack (callback) {
        cc.log('playerAttack');
        callback();//
    },

    enemyTurn (callback) {
        cc.log('enemyTurn');
        setTimeout(callback, this.enemyTurnTime * 1000)
    },

    drawCards (callback) {
        cc.log('drawCards');
        this.drawCardsCallback = callback;


        for (var i = this.cards.childrenCount; i < CardCount; i++) {
            var card = cc.instantiate(this.cardPrefab);
            var randomIndex = (Math.random() * this.cardDatas.length) | 0;
            var cardData = this.cardDatas[randomIndex];

            var cardComp = card.getComponent('Card');
            cardComp.init(this, cardData);
            card.parent = this.cards;
        }

        this.drawCardsFinished = true;
    },

    update () {
        if (this.drawCardsFinished) {
            this.drawCardsFinished = false;
            cc.log('drawCardsFinished');
            this.drawCardsCallback();
        }

        if (this.playerUseCardFinish) {
            this.playerUseCardFinish = false;
            this.playerUseCardCallback();
        }
    },
});
