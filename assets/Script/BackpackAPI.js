'use strict';

/**
 *  BackpackAPI.js 
 * 
 *  背包系统中用的接口
 * 
 *  by 傻狍子
 */

let content = [];
/**
 *  加载物品sprite frame
 */
function loadSpriteFrame(sfURL, callback){

    cc.loader.loadRes(sfURL, cc.SpriteFrame, callback);
}

/**
 *  获取Button节点上 sprite frame 为空的 Sprite组件
 * 
 *  return cc.Sprite or null;
 */
function getNullButton(_content){

    for(let i = 0; i < _content.length; i++){
        if(_content[i].getChildByName('Button').getComponent(cc.Sprite).spriteFrame === null){
            return _content[i].getChildByName('Button').getComponent(cc.Sprite);
        }
    }
    return null;
}

module.exports = {

    /**
     *  获取参数
     */
    getParam: function(_content){
        content = _content;
    },

    /**
     *  创建背包物品信息json的文件
     *  
     *  返回这个文件json
     * 
     *  return JSON
     */ 
    getFileData: function(){
        jsb.fileUtils.writeStringToFile(JSON.stringify([]), jsb.fileUtils.getWritablePath() + 'BpProps.json');
        return JSON.parse(jsb.fileUtils.getStringFromFile(jsb.fileUtils.getWritablePath() + 'BpProps.json'));
    },

    /**
     *  添加物品接口
     */ 
    addProp: function(id, _bpData){
        cc.loader.loadRes('data/AllProps', function(err, data){
            for(let i = 0; i < data.length; i++){
                if(data[i].id === id){
                    _bpData.push(data[i]);
                    jsb.fileUtils.writeStringToFile(JSON.stringify(_bpData), jsb.fileUtils.getWritablePath() + 'BpProps.json');
                    cc.loader.loadRes(('props/' + data[i].icon), cc.SpriteFrame, function(err, spriteFrame){
                        let sp= getNullButton(content);
                        _bpData[_bpData.length - 1].index = parseInt(sp.node.name) - 1;
                        sp.spriteFrame = spriteFrame;
                    });
                    break;
                }
            }
        });
    },

    /**
     *  删除物品接口
     */ 
    deleteProp: function(id, _bpData){
        for(let i = 0; i < _bpData.length; i++){     
            if(id === _bpData[i].id){
                let sp = content[_bpData[i].index].getChildByName('Button').getComponent(cc.Sprite);
                console.log('1');
                cc.loader.releaseAsset(sp.spriteFrame);
                sp.spriteFrame = null;
                _bpData.splice(i, 1);

                jsb.fileUtils.writeStringToFile(JSON.stringify(_bpData), jsb.fileUtils.getWritablePath() + 'BpProps.json');
                return true;
            }
        }
        return false;
    },

    /**
     *  加载全部物品到背包节点
     *  
     *  迷之坑, ccc模拟器不支持for of.
     */
    loadBackpackProps: function(_bpData, self){
        let _sprite = getNullButton(content);

        for(let i = 0; i < _bpData.length; i++){
            loadSpriteFrame(('props/' + _bpData[i].icon), function(err, spriteFrame){
                if(err || (_sprite === null)) { console.log('erroy: ' + err + '\n _sprite: ' + _sprite);}
                else{
                    
                    _sprite.spriteFrame = spriteFrame;
                    _sprite = getNullButton(content);
                }
                self.node.emit('loadCompeleted', {});
            });
        }
    },
}



