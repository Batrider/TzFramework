// Learn cc.Class:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/class.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/class.html
// Learn Attribute:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/reference/attributes.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/reference/attributes.html
// Learn life-cycle callbacks:
//  - [Chinese] http://docs.cocos.com/creator/manual/zh/scripting/life-cycle-callbacks.html
//  - [English] http://www.cocos2d-x.org/docs/creator/en/scripting/life-cycle-callbacks.html

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
        }
    },

    init: function() {
        this.isShield = false;
        this.isTrack = false;
        this.shieldSp.active = false;
        this.anim = this.node.getComponent(cc.Animation);
        this.anim.play('player1fly');
    },

    // LIFE-CYCLE CALLBACKS:
    onLoad() {

    },

    start() {
        // 定时子弹--
        this.schedule(this.fire.bind(this), Game.fireInterval);
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

    setInputControl: function() {
        var self = this;
        cc.eventManager.addListener({
            event: cc.EventListener.KEYBOARD,
            onKeyPressed: function(keyCode, event) {
                switch (keyCode) {
                    case cc.KEY.space: {
                        this.fire.bind(this);
                    }
                    default: {
                        break;
                    }
                }
            }
        }, self.node);

        // touch input
        cc.eventManager.addListener({
            event: cc.EventListener.TOUCH_ONE_BY_ONE,
            onTouchBegan: this.fire.bind(this)
        }, self.node);
    }
});
