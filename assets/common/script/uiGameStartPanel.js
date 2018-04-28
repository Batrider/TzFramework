var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        pictures: [cc.SpriteFrame],
        oneTwoThreeAudio: cc.AudioClip,
        readyGoAudio: cc.AudioClip
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.time = null;
        this.pictureNode = this.node.getChildByName("picture");
        this.sprite = this.pictureNode.getComponent(cc.Sprite);
        this.animation = this.node.getComponent(cc.Animation);
    },

    init () {
        this.count = 0;
        this.countDown();
        this.time = setInterval(this.countDown.bind(this), 1000);
    },

    countDown () {
        if (this.count >= 4) {
            uiFunc.closeUI("uiGameStartPanel");
            clearInterval(this.time);
            return;
        }
        if (this.count === 3) {
            cc.audioEngine.play(this.readyGoAudio, false, 1);
        } else {
            cc.audioEngine.play(this.oneTwoThreeAudio, false, 1);
        }

        this.pictureNode.active = false;
        this.sprite.spriteFrame = this.pictures[this.count];
        this.pictureNode.active = true;
        this.animation.play();
        this.count ++;
    },

    start () {

    },

    // update (dt) {},
});
