cc.Class({
    extends: cc.Component,

    onLoad() {
        Game.GameManager = this;
        clientEvent.init();
        dataFunc.loadConfigs();
        uiFunc.openUI("uiMaskLayout");
    }
});
