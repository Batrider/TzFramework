

var PanelAnimation = cc.Enum({
    None: -1,
    Scale: -1,
    Alpha: -1,
    ScaleAndAlpha: -1
});

cc.Class({
    extends: cc.Component,
    properties: {
        showAnimation: {
            default: PanelAnimation.None,
            type: PanelAnimation
        },
        hideAnimation: {
            default: PanelAnimation.None,
            type: PanelAnimation
        }
    },

    onLoad: function() {
        // node load --
        this.nodeDict = {};

        var linkWidget = function(self, nodeDict) {
            var children = self.children;
            for (var i = 0; i < children.length; i++) {
                var widgetName = children[i].name;
                if (widgetName && widgetName.indexOf("key_") >= 0) {
                    var nodeName = widgetName.substring(4);
                    if (nodeDict[nodeName]) {
                        cc.error("控件名字重复!" + children[i].name);
                    }
                    nodeDict[nodeName] = children[i];
                    if (children[i].childrenCount > 0) {
                        linkWidget(children[i], nodeDict[nodeName]);
                    }
                }
            }
        }.bind(this);
        linkWidget(this.node, this.nodeDict);
    },

    show: function() {
        if (this.showAnimation === PanelAnimation.None) {
            this.node.active = true;
        } else {
            var clipName = PanelAnimation[this.showAnimation];
            var anim = this.getComponent(cc.Animation);
            anim.play(clipName);
        }
    },

    hide: function() {
        if (this.hideAnimation === PanelAnimation.None) {
            this.node.active = false;
        } else {
            var clipName = PanelAnimation[this.hideAnimation];
            var anim = this.getComponent(cc.Animation);
            anim.play(clipName);
        }
    },
});
