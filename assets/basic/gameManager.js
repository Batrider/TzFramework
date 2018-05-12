var Game_State = cc.Enum({
    None: 0,
    GameStart: 1,
    GameOver: 2
})
cc.Class({
    extends: cc.Component,

    onLoad() {
        clientEvent.init();
        dataFunc.loadConfigs(null, this.countDown.bind(this));
        this.correctCount = 0;
        this.mistakeCount = 0;
        this.gameState = Game_State.None;
        clientEvent.on(clientEvent.eventType.correctEvent, this.correctEvent.bind(this));
        clientEvent.on(clientEvent.eventType.mistakeEvent, this.mistakeEvent.bind(this));
        clientEvent.on(clientEvent.eventType.gameOver, this.gameOver.bind(this));
        // uiFunc.openUI("uiFailPanel", function(panel) {
        //     panel.getComponent("uiFailPanel").init();
        // }.bind(this));
    },
    countDown () {
        uiFunc.openUI("uiGameStartPanel", function(panel) {
            var param = {
                callback: this.startGame.bind(this)
            }
            panel.getComponent("uiGameStartPanel").init(param);
        }.bind(this));
    },
    startGame () {
        this.gameState = Game_State.GameStart;
        console.log("游戏开始了！");
        this.setGameStartTime(new Date().getTime());
        clientEvent.dispatch(clientEvent.eventType.gameStart);
    },
    correctEvent () {
        this.correctCount ++;
    },
    mistakeEvent () {
        this.mistakeCount ++;
    },
    getAccuracy () {
        return (this.correctCount / (this.correctCount + this.mistakeCount)) * 100;
    },
    setGameStartTime (time) {
        this.gameStartTime = time;
    },
    setGameOverTime (time) {
        this.gameOverTime = time;
    },
    gameOver () {
        console.log("gameOver")
        this.gameState = Game_State.GameOver;
        var time = new Date().getTime();
        this.setGameOverTime(time);
        this.gameOverMsgPost();
    },
    getTotalTime () {
        return (this.gameOverTime - this.gameStartTime) / 1000;
    },
    gameOverMsgPost: function() {
        function getUrlParams() {
            var paras = {};
            var url = window.location.toString();
            var arrObj = url.split("?");
            if (arrObj.length > 1) {
                var tokenPara = arrObj[1].split("#");
                if (tokenPara.length > 1) {
                    paras["token"] = tokenPara[1];
                    var arrPara = tokenPara[0].split("&");
                    var arr;

                    for (var i = 0; i < arrPara.length; i++) {
                        arr = arrPara[i].split("=");
                        if (arr != null) {
                            paras[arr[0]] = arr[1];
                        }
                    }
                }
            }
            return paras;
        }
        this.urlParamas = getUrlParams();
        var data = {
            "curriculum_id": this.urlParamas["curriculum_id"],
            "curriculum_detail_id": this.urlParamas["curriculum_detail_id"],
            "classes_id": this.urlParamas["classes_id"],
            "student_id": this.urlParamas["student_id"],
            "game_name": "findOut" + this.urlParamas["game_postfix"],
            "game_type": this.urlParamas["type"],
            "correctPercent": this.getAccuracy().toFixed(2),
            "score": 10,
            "full_score": 10,
            "spend_time": this.getTotalTime().toFixed(2),
            "game_status": "completed"
        };
        data = JSON.stringify(data);
        console.log(data);
        this.toGameServer(data);
    },

    toWindowWeb: function(data) {
        window.parent.postMessage(data, "*");
    },

    toGameServer: function(data) {
        var xhr = new XMLHttpRequest();
        xhr.timeout = 3000;
        xhr.ontimeout = function() {
            console.log("time out");
        };
        xhr.open('POST', 'https://' + this.urlParamas["api"]);
        var token = this.urlParamas["token"];
        xhr.setRequestHeader('Content-type', 'application/json');
        xhr.setRequestHeader('Authorization', 'Bearer ' + token);
        xhr.send(data);
        xhr.onreadystatechange = function() {
            if (xhr.readyState === 4 && xhr.status === 200) {
                console.log(xhr.responseText);
                this.toWindowWeb(data);
            } else {
                console.log(xhr.statusText);
            }
        }.bind(this);
    },

    networkExample: function() {
        nano.init({
            host: "127.0.0.1",
            port: 3250,
            path: '/nano',
            reconnect: true
        }, function() {
            console.log("connect success by chenhao");
            nano.request("room.join", {}, function(data) {
                console.log(data);

                nano.on('onMessage', onMessage);
                nano.on("onMembers", onMembers);
                nano.on("onNewUser", onNewUser);
            });
        });

        function onMembers(data) {
            console.log("onMembers");
            console.log(data);
        };

        function onMessage(data) {
            console.log("onMessage");
            console.log(data);
        };

        function onNewUser(data) {
            console.log(("On New User"));
            console.log(data);
        };
    },

});
