cc.Class({
    extends: cc.Component,

    properties: {
        icon: {
            default: null,
            type: cc.Sprite
        },
        speed: 0
    },

    init: function(hostPlayer) {
        this.hostPlayer = hostPlayer;
        this.node.parent = hostPlayer.node.parent;
        var worldPos = hostPlayer.firePoint.convertToWorldSpaceAR(cc.v2(0, 0));
        var bulletPoint = this.node.parent.convertToNodeSpaceAR(worldPos);
        this.node.position = bulletPoint;
        this.speed *= hostPlayer.teamType === TeamType.Right ? -1 : 1;
    },

    onCollisionEnter: function(other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'bullet') {
            var bullet = other.node.getComponent('normalBullet');
            if (bullet) {
                if (bullet.hostPlayer.team !== this.hostPlayer.team) {
                    Game.bulletManger.recycleBullet(this);
                }
            }
        } else if (group === 'player') {
            var player = other.node.getComponent('player');
            if (player && player.teamType !== this.hostPlayer.teamType) {
                player.damage();
            }
        }
    },

    update(dt) {
        this.node.setPositionX(this.node.position.x + (this.speed * dt));
        if (this.node.position.y < -1000 || Math.abs(this.node.position.x) > 1000) {
            Game.bulletManger.recycleBullet(this);
        }
    }
});
