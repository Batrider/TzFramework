var mvs = require("Matchvs");
var GLB = require("Glb");
var uiPanel = require("uiPanel");
cc.Class({
    extends: uiPanel,
    onLoad() {
        this._super();
        this.playerHearts = this.nodeDict["playerHeartLayout"].children;
        this.enemyHearts = this.nodeDict["enemyHeartLayout"].children;
        this.countDownLb = this.nodeDict["countDownLb"].getComponent(cc.Label);
        this.node.on(cc.Node.EventType.TOUCH_START, this.fly, this);
        clientEvent.on(clientEvent.eventType.roundStart, this.roundStart, this);
        clientEvent.on(clientEvent.eventType.roundOver, this.roundOver, this);
    },

    roundStart: function() {
        // 回合画面表现--
        this.countDown();
        var curRound = Game.GameManager.curRound;
        this.nodeDict['roundCntLb'].getComponent(cc.Label).string = curRound.toString();
        this.nodeDict['roundStart'].getComponent(cc.Animation).play();
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
                if (GLB.isRoomOwner) {
                    this.timeOver();
                }
            }
        }.bind(this), 1000);
    },

    timeOver: function() {
        var msg = {
            action: GLB.TIME_OVER
        };
        Game.GameManager.sendEventEx(msg);
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

    fly: function() {
        if (Game.GameManager.gameState !== GameState.Play) {
            return;
        }
        var player = Game.playerManger.getPlayerByUserId(GLB.userInfo.id);
        if (!player || player.isDied) {
            return;
        }
        var msg = {
            action: GLB.PLAYER_FLY_EVENT
        };
        Game.GameManager.sendEventEx(msg);
    }
});
