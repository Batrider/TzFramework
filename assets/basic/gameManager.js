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
    },

    startGame: function() {
        console.log('游戏即将开始');
        cc.director.loadScene('game', function() {
            uiFunc.openUI("uiGamePanel", function() {
                this.gameState = GameState.Play;
            }.bind(this));
        }.bind(this));
    },

    roundOver: function() {
        var msg = {
            action: GLB.ROUND_OVER
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("回合结束事件发送失败", result.result);
        }
    },

    roundStart: function() {
        var msg = {
            action: GLB.ROUND_START
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("回合开始事件发送失败", result.result);
        }
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
    }
});
