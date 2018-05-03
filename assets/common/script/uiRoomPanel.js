var uiPanel = require("uiPanel");
var mvs = require("Matchvs");
var GLB = require("Glb");
cc.Class({
    extends: uiPanel,
    properties: {},

    onLoad() {
        this._super();
        this.playerIcons = [];
        this.playerModel = this.nodeDict["playerIcon"];
        this.playerModel.active = false;
        for (var i = 0; i < GLB.MAX_PLAYER_COUNT; i++) {
            var playerTemp = cc.instantiate(this.playerModel);
            playerTemp.active = true;
            this.nodeDict["playerLayout"].addChild(playerTemp);
            this.playerIcons.push(playerTemp);
        }


        mvs.response.joinRoomResponse = this.joinRoomResponse.bind(this);
        mvs.response.joinRoomNotify = this.joinRoomNotify.bind(this);
        var result = null;
        if (GLB.matchType === GLB.RANDOM_MATCH) {
            result = mvs.engine.joinRandomRoom(GLB.MAX_PLAYER_COUNT, '');
            if (result !== 0) {
                console.log('进入房间失败,错误码:' + result);
            }
        } else if (GLB.matchType === GLB.PROPERTY_MATCH) {
            var matchinfo = new mvs.MatchInfo();
            matchinfo.maxPlayer = GLB.MAX_PLAYER_COUNT;
            matchinfo.mode = 0;
            matchinfo.canWatch = 0;
            matchinfo.tags = GLB.tagsInfo;
            result = mvs.engine.joinRoomWithProperties(matchinfo, "joinRoomWithProperties");
            if (result !== 0) {
                console.log('进入房间失败,错误码:' + result);
            }
        }
    },

    startGame: function() {
        console.log('游戏即将开始');
        cc.director.loadScene('game');
    },

    joinRoomResponse: function(status, userInfoList, roomInfo) {
        if (status !== 200) {
            console.log('进入房间失败,异步回调错误码: ' + status);
        } else {
            console.log('进入房间成功');
            console.log('房间号: ' + roomInfo.roomID);
            this.nodeDict['title'].getComponent(cc.Label).string = '房间号: ' + roomInfo.roomID;
        }
        GLB.roomId = roomInfo.roomID;
        var userIds = [GLB.userInfo.id]
        console.log('房间用户: ' + userIds);

        var playerIcon = null;
        for (var j = 0; j < userInfoList.length; j++) {
            playerIcon = userInfoList[j].getComponent('playerIcon');
            if (playerIcon && !playerIcon.userInfo) {
                playerIcon.setData(GLB.userInfo);
                break;
            }
        }

        for (var i = 0; i < this.playerIcons.length; i++) {
            playerIcon = this.playerIcons[i].getComponent('playerIcon');
            if (playerIcon && !playerIcon.userInfo) {
                playerIcon.setData(GLB.userInfo);
                break;
            }
        }

        mvs.response.sendEventNotify = this.sendEventNotify.bind(this); // 设置事件接收的回调
        GLB.playerUserIds = userIds;


        if (userIds.length >= GLB.MAX_PLAYER_COUNT) {
            mvs.response.joinOverResponse = this.joinOverResponse.bind(this); // 关闭房间之后的回调
            var result = mvs.engine.joinOver("");
            console.log("发出关闭房间的通知");
            if (result !== 0) {
                console.log("关闭房间失败，错误码：", result);
            }

            GLB.playerUserIds = userIds;
        }
    },

    joinRoomNotify: function(roomUserInfo) {
        console.log("joinRoomNotify, roomUserInfo:" + JSON.stringify(roomUserInfo));
        if (GLB.playerUserIds.length === GLB.MAX_PLAYER_COUNT - 1) {
        }
    }
    ,

    joinOverResponse: function(joinOverRsp) {
        if (joinOverRsp.status === 200) {
            console.log("关闭房间成功");
            this.notifyGameStart();
        } else {
            console.log("关闭房间失败，回调通知错误码：", joinOverRsp.status);
        }
    }
    ,

    notifyGameStart: function() {
        GLB.isRoomOwner = true;

        var event = {
            action: GLB.GAME_START_EVENT,
            userIds: GLB.playerUserIds
        };

        mvs.response.sendEventResponse = this.sendEventResponse.bind(this); // 设置事件发射之后的回调
        var result = mvs.engine.sendEvent(JSON.stringify(event));
        if (result.result !== 0) {
            console.log('发送游戏开始通知失败，错误码' + result.result);
        }
        // 发送的事件要缓存起来，收到异步回调时用于判断是哪个事件发送成功
        GLB.events[result.sequence] = event;
        console.log("发起游戏开始的通知，等待回复");
    }
    ,

    sendEventResponse: function(info) {
        if (!info
            || !info.status
            || info.status !== 200) {
            console.log('事件发送失败');
        }

        var event = GLB.events[info.sequence]

        if (event && event.action === GLB.GAME_START_EVENT) {
            delete GLB.events[info.sequence]
            this.startGame();
        }
    }
    ,

    sendEventNotify: function(info) {
        if (info
            && info.cpProto
            && info.cpProto.indexOf(GLB.GAME_START_EVENT) >= 0) {

            GLB.playerUserIds = [GLB.userInfo.id]
            // 通过游戏开始的玩家会把userIds传过来，这里找出所有除本玩家之外的用户ID，
            // 添加到全局变量playerUserIds中
            JSON.parse(info.cpProto).userIds.forEach(function(userId) {
                if (userId !== GLB.userInfo.id) GLB.playerUserIds.push(userId);
            });
            this.startGame();
        }
    }
})
;
