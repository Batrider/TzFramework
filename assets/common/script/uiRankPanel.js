var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        ranksView: {
            default: null,
            type: cc.ScrollView
        }
    },

    onLoad: function() {
        this._super();
        console.log(this.nodeDict);
        console.log(this.nodeDict["rankTitle"]);
        this.nodeDict["rankTitle"].getComponent(cc.Label).string = "rank : " + UIFunc.uiList.length;

    },

    setData: function() {
        console.log("setData");
    }
});
