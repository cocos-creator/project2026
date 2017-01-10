let cards = {};

module.exports = {
    // load heroInfo data and portrait spriteFrame
    loadCards (cb) {
        cc.loader.loadRes('data/cards', function(err, data){
            if (err) {
                cc.error(err);
            } else {
                let list = data;
                // use this counter to callback when all spriteFrames are loaded
                let count = list.length;
                for (let i = 0; i < list.length; ++i) {
                    let cardInfo = list[i];
                    cards[cardInfo.id] = cardInfo;
                    let costArr = cardInfo.cost.split('|');
                    for (let idx = 0 ; idx < costArr.length; ++idx) {
                        costArr[idx] = parseInt(costArr[idx]);
                    }
                    cardInfo.cost = costArr;
                }
                if (cb) {
                    cb();
                }
            }
        });
    },
    getCard (id) {
        return cards[id];
    },
    cards
};
