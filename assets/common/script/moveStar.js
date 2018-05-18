

cc.Class({
    extends: cc.Component,

    properties: {
        audio: cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
    },

    init () {
        var pos = this.node.parent.convertToNodeSpaceAR(cc.p(960, 740))
        cc.audioEngine.play(this.audio, false, 1);
        var action = cc.moveTo(.5, pos);
        var callF = cc.callFunc(function() {
            this.node.active = false;
            clientEvent.dispatch(clientEvent.eventType.addScore);
        }.bind(this));
        this.node.runAction(cc.sequence(action, callF));
    },

    start () {

    },

    // update (dt) {},
});
