var mvs = require("Matchvs");
var GLB = require("Glb");

cc.Class({
    extends: cc.Component,
    onLoad() {
        Game.GameManager = this;
        cc.game.addPersistRootNode(this.node);
        cc.director.getCollisionManager().enabled = true;
        clientEvent.init();
        dataFunc.loadConfigs();
        this.matchVsInit();
        uiFunc.openUI("uiMaskLayout", function() {
        });

        this.friendHearts = 3;
        this.enemyHearts = 3;
        this.curRound = 1;
        this.gameState = GameState.None;

        clientEvent.on(clientEvent.eventType.roundOver, function(data) {
            this.curRound++;
            switch (data.loseCamp) {
                case Camp.Friend:
                    this.friendHearts -= 1;
                    break;
                case Camp.Enemy:
                    this.enemyHearts -= 1;
                    break;
                case Camp.None:
                    this.enemyHearts -= 1;
                    this.friendHearts -= 1;
                    break;
            }
            this.roundOver();
            if (this.enemyHearts <= 0 || this.friendHearts <= 0) {
                setTimeout(function() {
                    GLB.isGameOver = true;
                    this.gameState = GameState.Over;
                }.bind(this), 2000);
                this.gameState = GameState.Pause;
                // 结算界面--
            } else {
                // 下一回合--
                setTimeout(function() {
                    this.roundStart();
                    this.gameState = GameState.Play;
                }.bind(this), 2000);
                this.gameState = GameState.Pause;
            }
        }, this);

        mvs.response.sendEventNotify = this.sendEventNotify.bind(this);
    },

    startGame: function() {
        cc.director.loadScene('game', function() {
            uiFunc.openUI("uiGamePanel", function() {
                if (GLB.isRoomOwner) {
                    this.sendRoundStartMsg();
                }
            }.bind(this));
        }.bind(this));
    },

    sendRoundOverMsg: function() {
        var msg = { action: GLB.ROUND_OVER };
        this.sendEventEx(msg);
    },

    sendRoundStartMsg: function() {
        var msg = { action: GLB.ROUND_START };
        this.sendEventEx(msg);
    },

    matchVsInit: function() {
        mvs.response.initResponse = this.initResponse.bind(this);
        var result = mvs.engine.init(mvs.response, GLB.channel, GLB.platform, GLB.gameId);
        if (result !== 0) {
            console.log('初始化失败,错误码:' + result);
        }
    },


    initResponse: function() {
        console.log('初始化成功，开始注册用户');
        mvs.response.registerUserResponse = this.registerUserResponse.bind(this); // 用户注册之后的回调
        var result = mvs.engine.registerUser();
        if (result !== 0) {
            console.log('注册用户失败，错误码:' + result);
        } else {
            console.log('注册用户成功');
        }
    },

    registerUserResponse: function(userInfo) {
        var deviceId = 'abcdef';
        var gatewayId = 0;
        GLB.userInfo = userInfo;

        console.log('开始登录,用户Id:' + userInfo.id)

        mvs.response.loginResponse = this.loginResponse.bind(this); // 用户登录之后的回调
        var result = mvs.engine.login(
            userInfo.id, userInfo.token,
            GLB.gameId, GLB.gameVersion,
            GLB.appKey, GLB.secret,
            deviceId, gatewayId
        );
        if (result !== 0) {
            console.log('登录失败,错误码:' + result);
        }
    },

    loginResponse: function(info) {
        if (info.status !== 200) {
            console.log('登录失败,异步回调错误码:' + info.status);
        } else {
            console.log('登录成功');
            this.lobbyShow();
        }
    },

    lobbyShow: function() {
        uiFunc.openUI("uiLobbyPanel");
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
                    player.fireNotify();
                }
            }
        }

        if (info.cpProto.indexOf(GLB.NEW_ITEM_EVENT) >= 0) {
            Game.itemManager.spawnItemNotify(cpProto);
        }

        if (info.cpProto.indexOf(GLB.PLAYER_GET_ITEM_EVENT) >= 0) {
            player = this.getPlayerByUserId(cpProto.playerId);
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
            clientEvent.dispatch(clientEvent.eventType.roundOver, { loseCamp: Camp.None });
        }

        if (info.cpProto.indexOf(GLB.ROUND_START) >= 0) {
            clientEvent.dispatch(clientEvent.eventType.roundStart);
        }

        if (info.cpProto.indexOf(GLB.TIME_OVER) >= 0) {
            for (var m = 0; m < GLB.playerUserIds.length; m++) {
                player = this.getPlayerByUserId(GLB.playerUserIds[m]);
                if (player) {
                    player.dead();
                }
            }
            clientEvent.dispatch(clientEvent.eventType.roundOver, { loseCamp: Camp.None });
        }
    },

    sendEventEx: function(msg) {
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log(msg.action, result.result);
        }
    }

});
