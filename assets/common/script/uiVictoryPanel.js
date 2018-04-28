var uiPanel = require("uiPanel");

cc.Class({
    extends: uiPanel,

    properties: {
        victoryAudio: cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {

    },

    init () {
        cc.audioEngine.play(this.victoryAudio, false ,1);
    },

    start () {

    },

    // update (dt) {},
});
