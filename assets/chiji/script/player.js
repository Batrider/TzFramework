var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        playerSp: {
            default: null,
            type: cc.Sprite
        },
        shieldSp: {
            default: null,
            type: cc.Sprite
        },
        firePoint: {
            default: null,
            type: cc.Node
        },
        smokePrefab: {
            default: null,
            type: cc.Prefab
        },
        _camp: Camp.None,
        camp: {
            get() {
                return this._camp;
            },
            set(value) {
                this._camp = value;
            },
            type: Camp
        }
    },

    init: function(userId) {
        this.gravity = 1500;
        this.currentSpeed = 0;
        this.flySpeed = 800;
        this.groundY = -580;
        this.userId = userId;
        this.isShield = false;
        this.isTrack = false;
        this.shieldSp.node.active = false;
        this.anim = this.node.getComponent(cc.Animation);

        if (this.isSelf()) {
            this.setInputControl();
        }
    },

    update: function(dt) {
        this.currentSpeed -= dt * this.gravity;
        this.node.y += dt * this.currentSpeed;
        if (this.node.y < this.groundY) {
            this.node.y = this.groundY;
        }
    },

    getItem: function(itemType) {
        var msg = {
            action: GLB.PLAYER_GET_ITEM_EVENT,
            itemType: itemType
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("获得物品事件发送失败", result.result);
        }
    },

    getItemNotify: function(cpProto) {
        var itemType = cpProto.itemType;
        switch (itemType) {
            case ItemType.Shield:
                this.setShield(true);
                break;
            case ItemType.Track:
                this.setTrack(true);
                break;
            default:
                break;
        }
    },

    setShield: function(active) {
        this.isShield = active;
        this.shieldSp.active = active;
    },

    setTrack: function(active) {
        this.isTrack = active;
    },

    removeItem: function(itemType) {
        var msg = {
            action: GLB.PLAYER_REMOVE_ITEM_EVENT,
            itemType: itemType
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("移除物品事件发送失败", result.result);
        }
    },

    removeItemNotify: function(cpProto) {
        var itemType = cpProto.itemType;
        switch (itemType) {
            case ItemType.Shield:
                this.setShield(false);
                break;
            case ItemType.Track:
                this.setTrack(false);
                break;
            default:
                break;
        }
    },

    hurt: function() {
        var msg = {
            action: GLB.PLAYER_HURT_EVENT
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("受伤事件发送失败", result.result);
        }
    },

    hurtNotify: function(cpProto) {
        if (this.isShield) {
            this.setShield(false);
        } else {
            this.dead = true;
            // 死亡表现--
            this.anim.play('dead');
            this.currentSpeed = -1000;
            console.log('游戏结束');
        }
    },

    fly: function() {
        if (this.dead) {
            return;
        }
        var msg = {
            action: GLB.PLAYER_FLY_EVENT,
            speed: this.flySpeed,
            y: this.node.y
        };
        var result = mvs.engine.sendEventEx(0, JSON.stringify(msg), 0, GLB.playerUserIds);
        if (result.result !== 0) {
            console.log("移动事件发送失败", result.result);
        }
    },

    flyNotify: function(cpProto) {
        this.currentSpeed = cpProto.speed;
        // 做插值处理，平滑位置--
        this.node.y = cpProto.y;
        this.anim.play();
        // smoke
    },

    fireNotify: function() {
        if (this.dead) {
            return;
        }
        Game.bulletManger.spawnBullet(this);
    },

    setInputControl: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.space: {
                        self.fly();
                        break;
                    }
                }
            }
        }, self.node);
    },

    isSelf: function() {
        if (GLB.userInfo.id === this.userId) {
            return true;
        }
        return false;
    },
});
