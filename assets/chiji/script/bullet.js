var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: cc.Component,

    properties: {
        speed: 0
    },

    init: function(hostPlayer) {
        this.hostPlayer = hostPlayer;
        this.node.parent = hostPlayer.node.parent;
        var worldPos = hostPlayer.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        var bulletPoint = this.node.parent.convertToNodeSpaceAR(worldPos);
        this.node.position = bulletPoint;
    },

    onCollisionEnter: function(other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'bullet') {
            var bullet = other.node.getComponent('bullet');
            if (bullet && bullet.hostPlayer.camp !== this.hostPlayer.camp) {
                Game.bulletManger.recycleBullet(this);
            }
        } else if (group === 'player') {
            var player = other.node.getComponent('player');
            if (player && !player.isDied && player.camp !== this.hostPlayer.camp) {
                Game.bulletManger.recycleBullet(this);
                if (GLB.isRoomOwner) {
                    player.hurt();
                }
            }
        } else if (group === 'item') {
            Game.bulletManger.recycleBullet(this);
            var item = other.node.getComponent('item');
            if (item) {
                if (GLB.isRoomOwner) {
                    this.hostPlayer.getItem(item.itemType);
                }
            }
            other.node.destroy();
        }
    },

    update(dt) {
        this.node.setPositionX(this.node.position.x + (this.speed * dt));
        if (this.node.position.y < -1000 || Math.abs(this.node.position.x) > 1000) {
            Game.bulletManger.recycleBullet(this);
        }
    }
});
