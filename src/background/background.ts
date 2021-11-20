// background.js


// messages from popup.js
// Always return true for async connections for chrome.runtime.onConnect.addListener
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    // 2. A page requested user data, respond with a copy of `user`

  
    if (request.action === "PASH_DOWNLOAD_DATA"){ 

        let url = 'data:json/charset=utf-8,' +encodeURIComponent(request.data);
                
        chrome.downloads.download({
                url: url
        });

    }else if (request.action === "PASH_DOWNLOAD_LOG"){ 
            
        chrome.scripting.executeScript({
            target: { tabId: request.tabId },
            function: downloadConsole
        });

        function downloadConsole() {
            var data = localStorage.getItem("PASH_SAVE_LOGS");
            let message = { action: "PASH_DOWNLOAD_DATA",data:data };

            chrome.runtime.sendMessage(message, function (a) {
                // 3. Got an asynchronous response with the data from the background
            });
        }

        sendResponse('DOWNLOADED');

    }
    return true;
});

