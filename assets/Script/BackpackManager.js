// 引用对应模块
const bpMng = require('BackpackAPI');

/**
 *  背包组件
 */

cc.Class({
    extends: cc.Component,
    
    properties: {
        
    },

    // use this for initialization
    onLoad: function () {
        let self = this;
        let _bpData = [];
        let _content = cc.find('scrollView/view/content', this.node).getChildren();
        bpMng.getParam(_content);
        _bpData = bpMng.getFileData();
        

        /**
         *  api测试
         */

        // 往BpProps.json里添加对象   √
        bpMng.addProp('1001', _bpData);
             
        // 加载所有背包里的物品        √
        //bpMng.loadBackpackProps(_bpData, this);

        // 从BpProps.json里删除对象   √
        //this.node.on('loadCompeleted', function(data){
            //bpMng.deleteProp('1001', _bpData);
        //});
        
        
    },
});
