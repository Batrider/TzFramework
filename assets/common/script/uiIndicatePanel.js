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
        this.contentLabel = this.node.getChildByName("content").getComponent(cc.Label);
        this.buttonNode = this.node.getChildByName("button");
        this.buttonCallback = null;
        this.callBackParam = null;
    },

    initData () {
        this.buttonCallback = null;
        this.callBackParam = null;
    },

    init (param) {
        this.initData();
        console.log(param);
        this.contentLabel.string = param.labelString;
        if (!param.callback) {
            this.buttonNode.active = false;
            return;
        } else {
            this.buttonNode.active = true;
        }
        this.buttonCallback = param.callback;
        this.callBackParam = param.callBackParam;
    },

    buttonEvent () {
        if (this.callBackParam !== null) {
            this.buttonCallback(this.callBackParam);
        } else {
            this.buttonCallback();
        }

    }


    // update (dt) {},
});
