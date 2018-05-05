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
        _teamType: TeamType.None,
        teamType: {
            get() {
                return this._teamType;
            },
            set(value) {
                this._teamType = value;
            },
            type: TeamType
        },


    },

    init: function(userId) {
        this.gravity = 1500;
        this.currentSpeed = 0;
        this.flySpeed = 800;
        this.acc = this.gravity;
        this.groundY = -580;
        this.syncPosYs = [];
        this.userId = userId;
        this.isShield = false;
        this.isTrack = false;
        this.shieldSp.node.active = false;
        this.anim = this.node.getComponent(cc.Animation);
        this.anim.play('player1fly');

        if (this.isSelf()) {
            var id = setInterval(() => {
                var result = mvs.engine.sendFrameEvent(JSON.stringify({
                    action: GLB.PLAYER_POSITION_EVENT,
                    y: this.node.y,
                    ts: new Date().getTime()
                }));
                console.log(result);
                if (GLB.isGameOver === true) {
                    clearInterval(id);
                }
            }, 200);
            this.setInputControl();
        }
    },
    start() {
        // 定时子弹--
        this.schedule(this.fire.bind(this), Game.fireInterval);
    },

    update: function(dt) {
        if (this.isSelf()) {
            this.currentSpeed -= dt * this.gravity;
            this.node.y += dt * this.currentSpeed;
            if (this.node.y < this.groundY) {
                this.node.y = this.groundY;
            }
        } else {
            if (this.syncPosYs.length > 0) {
                if (!this.curSyncPosY) {
                    this.curSyncPosY = this.syncPosYs.pop();
                }
                this.node.y = cc.lerp(this.node.y, this.curSyncPosY, 10 * dt);
                if (Math.abs(this.node.y - this.curSyncPosY) < 5) {
                    this.curSyncPosY = null;
                }
            }
        }
    },


    getShield: function() {
        this.isShield = true;
        this.shieldSp.active = true;
    },

    getTrack: function() {
        this.isTrack = true;
    },

    damage: function() {
        if (this.isShield) {
            this.isShield = false;
            this.shieldSp.active = false;
        } else {
            this.dead = true;
            // 死亡表现--
        }
    },

    fly: function() {
        this.currentSpeed = this.flySpeed;
        this.sendFlyMessage();
    },

    fire: function() {
        if (this.isTrack) {
            Game.bulletManger.spawnTrackBullet();
        } else {
            var bullet = Game.bulletManger.spawnNormalBullet();
            if (bullet) {
                var bulletScript = bullet.getComponent("normalBullet");
                if (bulletScript) {
                    bulletScript.init(this);
                }
            }
        }
    },

    syncPosition: function() {
        // 不是自己就同步位置--
        // 由房主来控制分发事件--
    },

    sendFlyMessage: function() {
        var msg = { action: GLB.PLAYER_FLY_EVENT };
        msg.speed = this.currentSpeed;
        var result = mvs.engine.sendEvent(JSON.stringify(msg));
        if (result.result !== 0) {
            return console.error("移动事件发送失败", result.result);
        }
    },

    setInputControl: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.up: {
                        self.node.y += 10;
                        break;
                    }
                    case cc.KEY.down: {
                        self.node.y -= 10;
                        break;
                    }
                    case cc.KEY.space: {
                        self.fly();
                        break;
                    }
                    default: {
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
    }
});
