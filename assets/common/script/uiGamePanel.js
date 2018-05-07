var mvs = require("Matchvs");
var GLB = require("Glb");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,

    properties: {
        friendPrefabs: [cc.Prefab],
        enemyPrefabs: [cc.Prefab],
        friendPosX: 0,
        enemyPosX: 0
    },
    onLoad() {
        this._super();
        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
        this.playerHearts = this.nodeDict["playerHeartLayout"].children;
        this.enemyHearts = this.nodeDict["enemyHeartLayout"].children;
        this.countDownLb = this.nodeDict["countDownLb"].getComponent(cc.Label);
        this.node.on(cc.Node.EventType.TOUCH_START, this.fly, this);
        this.roundStart();
    },

    countDown: function() {
        clearInterval(this.countDownInterval);
        var times = Game.roundSeconds;
        this.countDownLb.string = times;
        this.countDownInterval = setInterval(function() {
            times--;
            this.countDownLb.string = times;
            if (times <= 0) {
                clearInterval(this.countDownInterval);
                this.timeOver();
            }
        }.bind(this), 1000);
    },

    timeOver: function() {
        var msg = {
            action: GLB.TIME_OVER
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("倒计时结束事件发送失败", result.result);
        }
    },

    roundOver: function() {
        var i;
        for (i = 0; i < this.playerHearts.length; i++) {
            if (i < Game.GameManager.friendHearts) {
                this.playerHearts[i].active = true;
            } else {
                this.playerHearts[i].active = false;
            }
        }
        for (i = 0; i < this.enemyHearts.length; i++) {
            if (i < Game.GameManager.enemyHearts) {
                this.enemyHearts[i].active = true;
            } else {
                this.enemyHearts[i].active = false;
            }
        }
        clearInterval(this.countDownInterval);
    },

    roundStart: function() {
        // 回合画面表现--
        this.countDown();
        var curRound = Game.GameManager.curRound;
        this.nodeDict['roundCntLb'].getComponent(cc.Label).string = curRound.toString();
        this.nodeDict['roundStart'].getComponent(cc.Animation).play();
        // 玩家就位--
        this.initPlayers();
    },


    // 玩家行为通知--
    sendEventNotify: function(info) {
        var cpProto = JSON.parse(info.cpProto);

        var player = null;
        if (info.cpProto.indexOf(GLB.PLAYER_FLY_EVENT) >= 0) {
            player = this.getPlayerByUserId(info.srcUserId);
            if (player) {
                player.flyNotify();
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
            player = this.getPlayerByUserId(cpProto.playerId);
            if (player) {
                player.hurtNotify();
            }
        }

        if (info.cpProto.indexOf(GLB.ROUND_OVER) >= 0) {
            this.roundOver();
        }

        if (info.cpProto.indexOf(GLB.ROUND_START) >= 0) {
            this.roundStart();
        }

        if (info.cpProto.indexOf(GLB.TIME_OVER) >= 0) {
            for (var m = 0; m < GLB.playerUserIds.length; m++) {
                player = this.getPlayerByUserId(GLB.playerUserIds[m]);
                if (player) {
                    player.dead();
                }
            }
        }
    },

    leaveRoomNotify: function(rsp) {
        console.log("leaveRoomNotify");
        GLB.isGameOver = true;
        // this.gameOver();
    },

    fly: function() {
        if (Game.GameManager.gameState !== GameState.Play) {
            return;
        }
        var player = this.getPlayerByUserId(GLB.userInfo.id);
        if (!player || player.isDied) {
            return;
        }
        var msg = {
            action: GLB.PLAYER_FLY_EVENT
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("移动事件发送失败", result.result);
        }
    },

    // 初始化玩家--
    initPlayers: function() {
        var player = null;
        var playerScript = null;
        if (this.players) {
            for (var j = 0; j < this.players.length; j++) {
                playerScript = this.players[j].getComponent("player");
                if (playerScript) {
                    if (playerScript.camp === Camp.Friend) {
                        playerScript.position = cc.v2(this.friendPosX, 0);
                    } else {
                        playerScript.position = cc.v2(this.enemyPosX, 0);
                    }
                    playerScript.init(playerScript.userId);
                }
            }
        } else {
            this.players = [];
            var campFlg = GLB.playerUserIds.length / 2;
            for (var i = 0; i < GLB.playerUserIds.length; i++) {
                if (i < campFlg) {
                    // 友方
                    player = cc.instantiate(this.friendPrefabs[i]);
                    player.parent = this.node;
                    player.position = cc.v2(this.friendPosX, 0);
                } else {
                    // 敌方
                    player = cc.instantiate(this.enemyPrefabs[i - campFlg]);
                    player.parent = this.node;
                    player.position = cc.v2(this.enemyPosX, 0);
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
    }
});
