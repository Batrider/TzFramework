var uiPanel = require("uiPanel");

cc.Class({
    extends: uiPanel,

    properties: {

    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.progressNode = this.node.getChildByName("progressBar");
        this.progress = this.progressNode.getComponent(cc.ProgressBar);
        this.icon = this.node.getChildByName("progressBar").getChildByName("icon");
        this.value = 0;
        this.maxValue = 10;
        this.maxWidth = 590;
        this.addValue(9)
    },
    addValue (val) {
        this.value += val;
        var result = this.value / this.maxValue;
        this.progress.progress = result;
        var maxWidth = this.progressNode.width;
        var x = (result - 0.5) * this.maxWidth;
        var y = this.icon.position.y;
        console.log(x)
        console.log("y:" + y);
        this.icon.setPosition(cc.p(x, y));
    },

    loading () {

    }

    // update (dt) {},
});
