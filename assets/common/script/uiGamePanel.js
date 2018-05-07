var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        friendPrefabs: [cc.Prefab],
        enemyPrefabs: [cc.Prefab],
        friendPosX: 0,
        enemyPosX: 0
    },
    onLoad() {
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
    },

    start() {
        // 生成玩家--
        this.InitPlayers();
    },

    // 玩家行为通知--
    sendEventNotify: function(info) {
        var cpProto = JSON.parse(info.cpProto);

        var player = null;
        if (info.cpProto.indexOf(GLB.PLAYER_FLY_EVENT) >= 0) {
            player = this.getPlayerByUserId(info.srcUserId);
            if (player) {
                player.flyNotify(cpProto);
            }
        }

        if (info.cpProto.indexOf(GLB.PLAYER_FIRE_EVENT) >= 0) {
            for (var i = 0; i < GLB.playerUserIds.length; i++) {
                player = this.getPlayerByUserId(GLB.playerUserIds[i]);
                if (player) {
                    player.fireNotify(cpProto);
                }
            }
        }

        if (info.cpProto.indexOf(GLB.PLAYER_GET_ITEM_EVENT) >= 0) {
            player = this.getPlayerByUserId(info.srcUserId);
            if (player) {
                player.getItemNotify(cpProto);
            }
        }

        if (info.cpProto.indexOf(GLB.PLAYER_REMOVE_ITEM_EVENT) >= 0) {
            player = this.getPlayerByUserId(info.srcUserId);
            if (player) {
                player.removeItemNotify(cpProto);
            }
        }

        if (info.cpProto.indexOf(GLB.PLAYER_HURT_EVENT) >= 0) {
            player = this.getPlayerByUserId(info.srcUserId);
            if (player) {
                player.hurtNotify(cpProto);
            }
        }
    },

    leaveRoomNotify: function(rsp) {
        console.log("leaveRoomNotify");
        GLB.isGameOver = true;
        // this.gameOver();
    },

    // 生成玩家
    InitPlayers: function() {
        this.players = [];
        var campFlg = GLB.playerUserIds.length / 2;
        for (var i = 0; i < GLB.playerUserIds.length; i++) {
            var player = null;
            var playerScript = null;
            if (i < campFlg) {
                // 友方
                player = cc.instantiate(this.friendPrefabs[i]);
                player.parent = this.node;
                player.position = cc.v2(this.friendPosX, 0);
                playerScript = player.getComponent("player");
                if (playerScript) {
                    playerScript.init(GLB.playerUserIds[i]);
                }
                this.players.push(player);
            } else {
                // 敌方
                player = cc.instantiate(this.enemyPrefabs[i - campFlg]);
                player.parent = this.node;
                player.position = cc.v2(this.enemyPosX, 0);
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
            if (GLB.playerUserIds[i] === userId) {
                return this.players[i].getComponent("player");
            }
        }
        return null;
    }
});
