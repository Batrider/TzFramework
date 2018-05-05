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
        mvs.response.frameUpdate = this.frameUpdate.bind(this);
        mvs.response.leaveRoomNotify = this.leaveRoomNotify.bind(this);

        if (GLB.syncFrame === true && GLB.isRoomOwner === true) {
            mvs.response.setFrameSyncResponse = this.setFrameSyncResponse.bind(this);
            var result = mvs.engine.setFrameSync(GLB.FRAME_RATE);
            if (result !== 0) {
                console.log('设置帧同步率失败,错误码:' + result);
            }
        }
        if (GLB.syncFrame === true) {
            console.log("同步帧率:" + GLB.FRAME_RATE);
        }
    },

    setFrameSyncResponse: function(rsp) {
        console.log('setFrameSyncResponse, status=' + rsp.mStatus);
        if (rsp.mStatus !== 200) {
            console.log('设置同步帧率失败，status=' + rsp.mStatus);
        } else {
            console.log('设置同步帧率成功, 帧率为:' + GLB.FRAME_RATE);
        }
    },

    start() {
        // 生成玩家--
        this.InitPlayers();
    },

    sendEventNotify: function(info) {
        if (info && info.cpProto) {
            if (info.cpProto.indexOf(GLB.PLAYER_FLY_EVENT) >= 0) {
                var cpProto = JSON.parse(info.cpProto);
                var player = this.getPlayerByUserId(info.srcUserId);
                if (player && !player.isSelf()) {
                    player.currentSpeed = cpProto.speed;
                }
            }
        }
    },

    frameUpdate: function(rsp) {
        for (var i = 0; i < rsp.frameItems.length; i++) {
            var info = rsp.frameItems[i];
            if (info && info.cpProto) {
                if (info.cpProto.indexOf(GLB.PLAYER_POSITION_EVENT) >= 0) {
                    var cpProto = JSON.parse(info.cpProto);
                    var player = this.getPlayerByUserId(info.srcUserID);
                    if (player && !player.isSelf()) {
                        player.syncPosYs.push(cpProto.y);
                    }
                }
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
