var normalBullet = require('normalBullet');
var trackBullet = require('trackBullet');

cc.Class({

    extends: cc.Component,
    properties: {
        normalBulletPrefab: {
            default: null,
            type: cc.Prefab
        },
        trackBulletPrefab: {
            default: null,
            type: cc.Prefab
        }
    },
    // LIFE-CYCLE CALLBACKS:

    onLoad() {
        Game.bulletManger = this;
        // 普通子弹--
        this.normalBulletPool = new cc.NodePool('normalBullet');
        // 追踪弹--
        this.trackBulletPool = new cc.NodePool('trackBullet');
    },

    spawnNormalBullet: function() {
        var temp = this.normalBulletPool.get(normalBullet)
        if (!temp) {
            temp = cc.instantiate(this.normalBulletPrefab);
        }
        return temp;
    },

    spawnTrackBullet: function() {
        var temp = this.trackBulletPool.get(trackBullet)
        if (!temp) {
            temp = cc.instantiate(this.trackBulletPrefab);
        }
        return temp;
    },

    recycleBullet: function(bullet) {
        bullet.node.active = false;
        if (bullet instanceof normalBullet) {
            this.normalBulletPool.put(bullet.node);
            return;
        }
        if (bullet instanceof trackBullet) {
            this.trackBulletPool.put(bullet.node);
            return;
        }
        bullet.node.destroy();
    }

});
