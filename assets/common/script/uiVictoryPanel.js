var uiPanel = require("uiPanel");

cc.Class({
    extends: uiPanel,

    properties: {
        victoryAudio: cc.AudioClip,
        moveStar: cc.Prefab
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.moveStarParent = this.node.getChildByName("moveStarParent");
        this.animation = this.getComponent(cc.Animation);
        this.animationName = "victoryStar";
        this.numLabel = this.node.getChildByName("num").getComponent(cc.Label);
        this.time = null;
        clientEvent.on(clientEvent.eventType.addScore, this.addScore.bind(this));
        this.callback = null;
        this.animation.on("finished", this.animFinished, this);
    },

    init (param) {
        this.callback = param.callBack;
        this.numLabel.string = "0";
        this.count = 10;
        this.putMoveStar()
        this.time = setInterval(this.putMoveStar.bind(this), 300);
    },

    putMoveStar () {
        if (this.count <= 0) {
            clearInterval(this.time);
            return;
        }
        var star = cc.instantiate(this.moveStar);
        star.parent = this.moveStarParent;
        var item = star.getComponent("moveStar");
        item.init();
        this.count --;
    },

    addScore () {
        var number = Number(this.numLabel.string);
        number++;
        this.numLabel.string = number.toString();
        if (number == 10){
            this.animation.play(this.animationName);
            cc.audioEngine.play(this.victoryAudio, false ,1);

        }
    },

    animFinished () {
        if(this.count <= 0) {
            this.callback();
        }
    },

    start () {

    },

    // update (dt) {},
});
