// TODO: content script
console.log('<----- Content script started running ----->');

var s = document.createElement('script');
s.src = chrome.runtime.getURL('injected_script.js');
s.async = false;

(document.head).appendChild(s);
s.onload = function() {
    s.parentNode.removeChild(s);
}


chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

    if(message.action =="PASH_START_CAPTURING" ){
        window.postMessage({ type: "PASH_START_CAPTURING"},location.href);
        sendResponse({farewell:"PASH_STARTED_CAPTURING"});
    }

});