// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

cc.Class({
    extends: cc.Component,

    properties: {
        friendPrefabs: [cc.Prefab],
        enemyPrefabs: [cc.Prefab],
        friendPosX: 0,
        enemyPosX: 0
    },

    onLoad() {
        Game.PlayerManger = this;
        clientEvent.on(clientEvent.eventType.roundStart, this.initPlayers, this);
    },

    // 初始化玩家--
    initPlayers: function() {
        var uiGamePanel = uiFunc.findUI("uiGamePanel");
        if (!uiGamePanel) {
            return;
        }
        var playerScript = null;
        if (this.players) {
            for (var j = 0; j < this.players.length; j++) {
                playerScript = this.players[j].getComponent("player");
                if (playerScript) {
                    if (playerScript.camp === Camp.Friend) {
                        playerScript.position = cc.v2(this.friendPosX, -500);
                    } else {
                        playerScript.position = cc.v2(this.enemyPosX, -500);
                    }
                    playerScript.init(playerScript.userId);
                }
            }
        } else {
            var player = null;
            this.players = [];
            var campFlg = GLB.playerUserIds.length / 2;
            for (var i = 0; i < GLB.playerUserIds.length; i++) {
                if (i < campFlg) {
                    // 友方
                    player = cc.instantiate(this.friendPrefabs[i]);
                    player.parent = uiGamePanel;
                    player.position = cc.v2(this.friendPosX, -500);
                } else {
                    // 敌方
                    player = cc.instantiate(this.enemyPrefabs[i - campFlg]);
                    player.parent = uiGamePanel;
                    player.position = cc.v2(this.enemyPosX, -500);
                }
                playerScript = player.getComponent("player");
                if (playerScript) {
                    playerScript.init(GLB.playerUserIds[i]);
                }
                this.players.push(player);
            }
        }
    },

    getPlayerByUserId: function(userId) {
        for (var i = 0; i < GLB.playerUserIds.length; i++) {
            if (GLB.playerUserIds[i] === userId && this.players && this.players[i]) {
                return this.players[i].getComponent("player");
            }
        }
        return null;
    },

    onDestroy: function() {
        clientEvent.off(clientEvent.eventType.roundStart, this.initPlayers, this);
    }
});
