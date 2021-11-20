import React from "react";
import ReactDOM from "react-dom";
import "./popup.scss";

const App: React.FC<{}> = () => {
  return (
    <div id="wrap">
        <button className="current success" id="exportButton">Download Log</button>
        <button className="current log" id="whatToCapture">Cature Console</button>

        <script src="popup.js"></script>
      </div>
  );
};

const root = document.createElement("div");
document.body.appendChild(root);
ReactDOM.render(<App />, root);



(function () {
	var captureButton = document.getElementById('whatToCapture');

	captureButton.onclick = function (event) {
			// get active tab and send message
			chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
				chrome.tabs.sendMessage(tabs[0].id, {action: "PASH_START_CAPTURING"}, function(response) {
				  console.log(response.farewell);
				});
			  });
	}


	var exportButton = document.getElementById('exportButton');

	exportButton.onclick = function (event) {
			// get active tab and send message
			chrome.tabs.query({
				active: true,
				currentWindow: true,
			}, function (tabs) {
				var tab = tabs[0];
				let message = { action: "PASH_DOWNLOAD_LOG", tabId: tab.id,event:event };
	
				chrome.runtime.sendMessage(message, function (a) {
					// 3. Got an asynchronous response with the data from the background
					console.log('received data', a);
					});
	
			});
	}
})();


