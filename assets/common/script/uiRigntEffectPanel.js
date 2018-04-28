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
        cc.audioEngine.play(this.rigntAudio);
    },
    animFinished () {
        setTimeout(function() {
            uiFunc.closeUI("uiRigntEffectPanel");
        }.bind(this), 300);
    },


    // update (dt) {},
});
