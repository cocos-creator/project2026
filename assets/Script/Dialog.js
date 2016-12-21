var DialogParser = require("DialogParser");
var DialogData = require("DialogData");

cc.Class({
    extends: cc.Component,

    properties: {
        optionPrefab: cc.Prefab,
        phraseLabel: cc.Label,
        optionPanel: cc.Node
    },

    // use this for initialization
    onLoad: function () {
        var self = this;
        cc.loader.loadRes("dialogs/lileihanmeimei", function (error, content) {
            if (error) {
                cc.log(error);
            }
            else {
                self.dialog = DialogParser.parseDialog(content);
                self.dialog.start();
                self.stepDialog();
            }
        });

        this.node.on('touchend', function () {
            this.stepDialog();
        }, this)
    },

    stepDialog: function () {
        if (!this.dialog) return;

        this.optionPanel.active = false;
        var curr = this.dialog.next();
        switch (curr.type) {
        case DialogData.Type.PHRASE:
            var role = this.dialog.getRole(curr.role);
            this.phraseLabel.string = role + ": " + curr.phrase;
            break;
        case DialogData.Type.OPTION:
            this.optionPanel.removeAllChildren();
            this.optionPanel.active = true;
            var options = curr.options;
            for (var i = 0, l = options.length; i < l; ++i) {
// TODO: need use option object pool
                var option = cc.instantiate(this.optionPrefab);
// TODO: Add component to option prefab
                option.children[0].getComponent(cc.Label).string = options[i];
                this.optionPanel.addChild(option);
            }
            break;
        }
    }
});
