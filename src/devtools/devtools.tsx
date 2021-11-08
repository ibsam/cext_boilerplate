// Can use
// chrome.devtools.*
// chrome.extension.*

// most likely this will run when devtools opens
var backgroundPageConnection = chrome.runtime.connect({
    name: "devtools-page"
});



(function createChannel() {
    //Create a port with background page for continous message communication
    var port = chrome.runtime.connect({
        name: "Another Communication" //Given a Name
    });

    // Listen to messages from the background page
    port.onMessage.addListener(function (message) {
       
    });

}());