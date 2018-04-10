window.UIFunc = {
    uiList: [],
    cacheUIList: []
};

UIFunc.openUI = function(uiName, callBack) {
    // 缓存--
    for (var i = 0; i < UIFunc.cacheUIList.length; i++) {
        var temp = UIFunc.cacheUIList[i];
        if (temp && temp.name === uiName) {
            temp.active = true;
            temp.parent = cc.Canvas.instance.node;
            UIFunc.uiList.push(temp)
            delete UIFunc.cacheUIList[i];
            if (callBack) {
                callBack(temp);
            }
            //todo 动画--
            if (callBack) {
                callBack(temp);
            }
            return;
        }
    }
    // 非缓存--
    cc.loader.loadRes('ui/' + uiName, function(err, prefab) {
        if (err) {
            cc.error(err.message || err);
            return;
        }

        var temp = cc.instantiate(prefab);
        temp.parent = cc.Canvas.instance.node;
        UIFunc.uiList.push(temp)
        //todo 动画--
        if (callBack) {
            callBack(temp);
        }
    });
};

UIFunc.closeUI = function(uiName, callBack) {
    for (var i = UIFunc.uiList.length - 1; i >= 0; i--) {
        var temp = UIFunc.uiList[i];
        if (temp && temp.name === uiName) {
            temp.active = false;
            temp.removeFromParent(true);
            UIFunc.cacheUIList.push(temp);
            delete UIFunc.uiList[i];
            //todo 动画--
            if (callBack) {
                callBack();
            }
            return;
        }
    }
}
