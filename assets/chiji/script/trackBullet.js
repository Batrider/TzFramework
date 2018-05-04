cc.Class({
    extends: cc.Component,

    properties: {
        icon: {
            default: null,
            type: cc.Sprite
        },
        speed: 0,
    },

    initData: function() {

    },

    onCollisionEnter: function(other) {
        var group = cc.game.groupList[other.node.groupIndex];
        if (group === 'player') {
            var player = other.node.getComponent('player');
            if (player) {
                player.damage();
            }
        }
    },

    start() {

    },

    update(dt) {
        this.node.setPositionX(this.node.position.x + (this.speed * dt));
        if (this.node.position.y < -1000 || Math.abs(this.node.position.x) > 1000) {
            Game.bulletManger.recycleBullet(this.node);
        }
    }
});
