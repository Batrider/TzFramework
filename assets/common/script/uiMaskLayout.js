var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    // LIFE-CYCLE CALLBACKS:
    start() {
        clientEvent.on(clientEvent.eventType.openUI, this.uiOperateCallBack, this);
        clientEvent.on(clientEvent.eventType.closeUI, this.uiOperateCallBack, this);
        this.isUseMask = false;
        this.node.active = false;
    },

    uiOperateCallBack: function() {
        var curShowUI = uiFunc.uiList[uiFunc.uiList.length - 1];
        if (!curShowUI || curShowUI === this.node) {
            console.log("current show ui is null!");
            this.node.active = false;
            return;
        }
        else {
            this.node.active = true;
        }

        var uiTargetPanel = curShowUI.getComponent("uiPanel");
        if (!uiTargetPanel) {
            console.log("target uiPanel no exist!");
            return;
        }
        if (uiTargetPanel.isUseMask) {
            this.node.setSiblingIndex(Number.MAX_SAFE_INTEGER);
            uiTargetPanel.node.setSiblingIndex(Number.MAX_SAFE_INTEGER);
        }
    },

    refresh: function() {

        var curShowUI = uiFunc.uiList[uiFunc.uiList.length - 1];
        if (!curShowUI) {
            console.warn("current show ui is null!");
            this.node.active = false;
            return;
        }
        else {
            this.node.active = true;
        }
        var uiTargetPanel = curShowUI.getComponent("uiPanel");
        if (!uiTargetPanel) {
            console.warn("target uiPanel no exist!");
            return;
        }
        if (uiTargetPanel.isUseMask) {
            this.node.setSiblingIndex(Number.MAX_SAFE_INTEGER);
            uiTargetPanel.node.setSiblingIndex(Number.MAX_SAFE_INTEGER);
        }
    },

    onDestroy: function() {
        clientEvent.off(clientEvent.eventType.openUI, this.uiOperateCallBack, this);
        clientEvent.off(clientEvent.eventType.closeUI, this.uiOperateCallBack, this);
    }
});
