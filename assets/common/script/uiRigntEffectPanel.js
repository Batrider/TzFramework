var uiPanel = require("uiPanel");

cc.Class({
    extends: uiPanel,

    properties: {
        // foo: {
        //     // ATTRIBUTES:
        //     default: null,        // The default value will be used only when the component attaching
        //                           // to a node for the first time
        //     type: cc.SpriteFrame, // optional, default is typeof default
        //     serializable: true,   // optional, default is true
        // },
        // bar: {
        //     get () {
        //         return this._bar;
        //     },
        //     set (value) {
        //         this._bar = value;
        //     }
        // },
    },

    // LIFE-CYCLE CALLBACKS:

    onLoad () {
        this.animation = this.node.getComponent(cc.Animation);
        this.animation.on("finished", this.animFinished.bind(this));
    },
    init () {
        this.animation.play();
    },
    animFinished () {
        setTimeout(function() {
            uiFunc.closeUI("uiRigntEffectPanel");
        }.bind(this), 300);
    },


    // update (dt) {},
});
