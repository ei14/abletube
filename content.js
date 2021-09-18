let injection = document.createElement("script");
injection.src = chrome.runtime.getURL("inject.js");
document.head.appendChild(injection);
