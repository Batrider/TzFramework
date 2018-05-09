var mvs = require("Matchvs");
var GLB = require("Glb");

cc.Class({
    extends: cc.Component,

    properties: {
        itemPrefabs: [cc.Prefab]
    },

    onLoad() {
        Game.ItemManager = this;
        if (GLB.isRoomOwner) {
            clearInterval(this.scheduleSpawn);
            this.scheduleSpawn = setInterval(function() {
                this.scheduleSpawnItem();
            }.bind(this), 8000);
        }
    },

    scheduleSpawnItem: function() {
        if (Game.GameManager.gameState === GameState.Over || Game.GameManager.gameState === GameState.Pause) {
            return;
        }
        var index = dataFunc.randomNum(0, this.itemPrefabs.length - 1);
        var position = cc.v2(0, dataFunc.randomNum(-450, 350));
        var msg = {
            action: GLB.NEW_ITEM_EVENT,
            itemIndex: index,
            position: position
        };
        Game.GameManager.sendEventEx(msg);
    },

    spawnItemNotify: function(cpProto) {
        if (this.item) {
            this.item.destroy();
        }
        this.item = cc.instantiate(this.itemPrefabs[cpProto.itemIndex]);
        this.item.parent = this.node;
        var gamePanel = uiFunc.findUI("uiGamePanel");
        if (gamePanel) {
            var gamePanelScript = gamePanel.getComponent("uiGamePanel");
            if (gamePanelScript) {
                var parent = gamePanelScript.nodeDict["itemParent"];
                this.item.parent = parent;
                this.item.position = cpProto.position;
            }
        }
    }
});
