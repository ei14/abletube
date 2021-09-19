let injection = document.createElement("script");
injection.src = chrome.runtime.getURL("inject.js");
document.head.appendChild(injection);
console.log(localStorage.getItem("at-keybinds"));

if(!localStorage.getItem("at-keybinds")) {
	localStorage.setItem("at-keybinds", "KeyQ,KeyW");
}
setInterval(() => {
	chrome.storage.local.get(["keybinds"], (items) => {
		localStorage.setItem("at-keybinds", items.keybinds);
	});
}, 1000);
