var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {

    },

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on("finished", this.animFinished.bind(this));
    },
    init () {
        this.animation.play();
    },
    animFinished () {
        setTimeout(function() {
            uiFunc.closeUI("uiWrongEffectPanel");
        }.bind(this), 500);
    },

});
