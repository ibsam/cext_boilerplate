// background.js

var attachedTabs = {};
var version = "1.0";

var storage = chrome.storage.local;

let db = null;

// is devtools open
var openCount = 0;
var isDevToolsOpen = false;

var gTabId;
var logData = [];

let roster = [{
    'id':0,
    'level': "test",
    'networkRequestId': "test",
    'source': "test",
    'text': "test",
    'timestamp': 'test',
    'url': "https://example.com"
    }]

create_database();

function create_database() {
    const request = indexedDB.open('MyTestDB');

    request.onerror = function (event) {
        console.log("Problem opening DB.");
    }

    request.onupgradeneeded = function (event:any) {
        db = event.target.result;

        let objectStore = db.createObjectStore('roster', {
            keyPath: 'id', autoIncrement: true
        });

        objectStore.transaction.oncomplete = function (event) {
            console.log("ObjectStore Created.");
        }
    }

    request.onsuccess = function (event:any) {
        db = event.target.result;
        console.log("DB OPENED.");
        insert_records(roster);
    }
}

function insert_records(records) {
    if (db) {
        const insert_transaction = db.transaction("roster", "readwrite");
        const objectStore = insert_transaction.objectStore("roster");

        return new Promise((resolve, reject) => {
            insert_transaction.oncomplete = function () {
                console.log("ALL INSERT TRANSACTIONS COMPLETE.");
                resolve(true);
            }
            records.forEach(record => {
                let request = objectStore.add(record);

                request.onsuccess = function () {
                    // console.log("id: ", record);
                }
            });
        });
    }
}

 // background.js
function get_records() {
    if (db) {
        const get_transaction = db.transaction("roster", "readonly");
        const objectStore = get_transaction.objectStore("roster");

        return new Promise((resolve, reject) => {
            get_transaction.oncomplete = function () {
            console.log("ALL GET TRANSACTIONS COMPLETE.");
            }

            get_transaction.onerror = function () {
            console.log("PROBLEM GETTING RECORDS.")
            }

            let request = objectStore.getAll();

            request.onsuccess = function (event) {
            resolve(event.target.result);
            }
        });
    }
}

function onEvent(debuggeeId, message, params) {
  //    console.log(params.entry)
  if (gTabId != debuggeeId.tabId)
      return;
    insert_records([params.entry]);
    logData.push(params)
}

function onAttach(tabId) {
    gTabId = tabId;
    if (chrome.runtime.lastError) {
      return;
    }

    // use Log.enable and go from there
    chrome.debugger.sendCommand({ tabId: tabId }, "Log.enable");
    chrome.debugger.onEvent.addListener(onEvent);

    setTimeout(() => {
        let harBLOB = new Blob([JSON.stringify(logData)]);
        // cleanup after downloading file
        chrome.debugger.sendCommand({ tabId: tabId }, "Log.disable");
        chrome.debugger.detach({ tabId: tabId });
        gTabId = undefined;
        logData = [];
    }, 1000);
    
}

// Always return true for async connections for chrome.runtime.onConnect.addListener
chrome.runtime.onConnect.addListener(function (port) {
    if (port.name == "devtools-page") {
    if (openCount == 0) {
        isDevToolsOpen = true
        console.log("DevTools window opening.");
    }
    openCount++;

    port.onDisconnect.addListener(function(port) {
        openCount--;
        if (openCount == 0) {
            isDevToolsOpen = false
        }
    });
    }
    return true;
});

// messages from popup.js
// Always return true for async connections for chrome.runtime.onConnect.addListener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`

    let info = {
    request : JSON.stringify(request),
    sender : JSON.stringify(sender),
    sendResponse : JSON.stringify(sendResponse)
    }

    if (request.action === "getConsoleLog"){

        chrome.debugger.attach({tabId:request.tabId}, version,
            onAttach.bind(null, request.tabId));

    }else if (request.action === "donwloadLog"){ 

        var allRecords  = get_records().then((value) => {
          let url = 'data:text/plain,' +encodeURIComponent(JSON.stringify(value));
          chrome.downloads.download({
              url: url
          });
        }); 
    }
    return true;
});

