cc.view.enableAntiAlias(false);
const Loading = require('Loading');

cc.Class({
    extends: cc.Component,

    properties: {
        loading: Loading
    },

    // use this for initialization
    onLoad: function () {
        cc.game.addPersistRootNode(this.node);
        this.loading.startLoading();
    },

    // called every frame, uncomment this function to activate update callback
    // update: function (dt) {

    // },
    loadScene (sceneName) {
        this.loading.startLoading();
        this.curLoadingScene = sceneName;
        cc.director.preloadScene(sceneName, this.onSceneLoaded);
    },

    onSceneLoaded () {
        this.loading.stopLoading();
        cc.director.loadScene(this.curLoadingScene);

    }
});
