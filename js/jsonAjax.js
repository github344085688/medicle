/**
 * mounted by admin on 2017/10/23.
 */

var store;

function Stages() {
    if (!"indexedDB" in window) return;
    this.openRequest = indexedDB.open("Stagesdb", 1);
    this.openRequest.onupgradeneeded = function(e) {
        var thisDB = e.target.result;
        if (!thisDB.objectStoreNames.contains("stage")) {
            thisDB.createObjectStore("stage", {
                keyPath: "keyname"
            }).createIndex('Indexkey', 'keyname', {
                unique: false
            });
        }
    };
    this.openRequest.onsuccess = function(e) {
        stahedb = e.target.result;
    };
    this.openRequest.onerror = function(e) {};
}
Stages();

function setstages(data) {
    for (key in data) {
        setStages(data[key].keyname, data[key])
    }
};

function setStages(name, data) {
    var store = stahedb.transaction(["stage"], "readwrite").objectStore("stage");
    var index = store.index("Indexkey");
    index.get(name).onsuccess = function(e) {
        var student = e.target.result;
        if (student == undefined) {
            console.log(student)
            store.add(data);
        } else {
            store.put(data);
        }
    };
}

function getStages(stagename) {
    var store = stahedb.transaction(["stage"], "readwrite").objectStore("stage");
    var cursor = store.openCursor();
    var index = store.index("Indexkey");
    index.get(stagename).onsuccess = function(e) {

        if (e.target.result == undefined) {
            StagesBoolean(false)
            getStagesData(e.target.result)
        } else {
            StagesBoolean(true)
            getStagesData(e.target.result)
        }
    }
}
var BooleanStages;

function StagesBoolean(boolean) {
    BooleanStages = boolean;
}
var StagesDatas;

function getStagesData(Data) {
    StagesDatas = Data;
}

function clears() {
    var request = stahedb.transaction(["stage"], "readwrite").objectStore("stage").clear();
    request.onsuccess = function() {
        window.location.href = golinks("weixinsq.html")
    }
}

function jsonAjax(url, param, datat) {
    var Url = 'http://api.zayata.com/index.php?s=' + url
    return $.ajax({
        headers: {
            "api-version": "1.1",
            "api-lang": "zh-cn"
        },
        type: "post",
        url: Url,
        data: param,
        dataType: 'json',
    });
}

function golinks(url) {
    return 'http://web.zayata.com/' + url;
}