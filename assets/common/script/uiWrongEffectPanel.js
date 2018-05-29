var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        wrongAudio: cc.AudioClip
    },

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on("finished", this.animFinished.bind(this));
        this.animation.on("pause", this.animFinished.bind(this));
    },
    init () {
        this.animation.play();
        cc.audioEngine.play(this.wrongAudio, false, 1);
    },
    animFinished () {
        setTimeout(function() {
            uiFunc.closeUI("uiWrongEffectPanel");
        }.bind(this), 500);
    },

});
