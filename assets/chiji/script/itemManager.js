var mvs = require("Matchvs");
var GLB = require("Glb");

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefabs: [cc.Prefab]
    },

    onLoad() {
        Game.itemManager = this;

        if (GLB.isRoomOwner) {
            var scheduler = cc.director.getScheduler();
            scheduler.scheduleCallbackForTarget(
                this,
                this.scheduleSpawnItem.bind(this),
                Game.itemInterval,
                Number.MAX_VALUE,
                5,
                !this._isRunning
            );
        }
    },
    // 随机生成物品--
    scheduleSpawnItem: function() {
        var index = dataFunc.randomNum(0, this.itemPrefabs.length - 1);
        var item = cc.instantiate(this.itemPrefabs[index]);
        item.parent = this.node;

        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            var parent = gamePanel.nodeDict["itemParent"];
            item.parent = parent;
            item.position = cc.v2(0, dataFunc.randomNum(-600, 600));
        }
    }

});
