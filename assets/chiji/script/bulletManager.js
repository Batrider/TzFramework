var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({

    extends: cc.Component,
    properties: {
        friendBulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        enemyBulletPrefab: {
            default: null,
            type: cc.Prefab
        }
    },

    onLoad() {
        Game.bulletManger = this;
        // 己方子弹--
        this.friendBulletPool = new cc.NodePool();
        // 敌方子弹--
        this.enemyBulletPool = new cc.NodePool();

        if (GLB.isRoomOwner) {
            this.schedule(this.scheduleFire.bind(this), Game.fireInterval);
        }
    },

    scheduleFire: function() {
        if (Game.GameManager.gameState === GameState.Over || Game.GameManager.gameState === GameState.Pause) {
            return;
        }
        var msg = {
            action: GLB.PLAYER_FIRE_EVENT
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log(" 定时开火事件发送失败", result.result);
        }
    },


    spawnBullet: function(hostPlayer) {
        var bulletObj = null;
        if (hostPlayer.camp === Camp.Enemy) {
            bulletObj = this.enemyBulletPool.get()
            if (!bulletObj) {
                bulletObj = cc.instantiate(this.enemyBulletPrefab);
            }
        } else {
            bulletObj = this.friendBulletPool.get()
            if (!bulletObj) {
                bulletObj = cc.instantiate(this.friendBulletPrefab);
            }
        }
        if (bulletObj) {
            var bulletScript = bulletObj.getComponent('bullet');
            if (bulletScript) {
                bulletScript.init(hostPlayer);
            }
        }
    },

    recycleBullet: function(bulletScript) {
        if (bulletScript.hostPlayer.camp === Camp.Enemy) {
            this.enemyBulletPool.put(bulletScript.node);
        } else {
            this.friendBulletPool.put(bulletScript.node);
        }
    }
});
