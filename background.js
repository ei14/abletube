var fired = false;
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
	if(!fired && changeInfo.status == "complete") {
		fired = true;
		chrome.tabs.query({active: true, currentWindow: true}, (tabs) => {
			chrome.tabs.executeScript(tabs[0].id, {
				file: "inject.js"
			});
		});
	}
});
