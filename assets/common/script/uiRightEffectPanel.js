var uiPanel = require("uiPanel");

cc.Class({
    extends: uiPanel,

    properties: {
       rigntAudio: cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on("finished", this.animFinished.bind(this));
    },
    init () {
        this.animation.play();
        cc.audioEngine.play(this.rigntAudio, false, .3);
    },
    animFinished () {
        setTimeout(function() {
            uiFunc.closeUI("uiRightEffectPanel");
        }.bind(this), 300);
    },


    // update (dt) {},
});
