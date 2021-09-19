var bindCodes;
chrome.storage.local.get(["keybinds"], (items) => {
	if(items.keybinds) {
		bindCodes = items.keybinds.split(',');
	} else {
		bindCodes = ["KeyQ", "KeyW"];
		chrome.storage.local.set({"keybinds": bindCodes.join(',')}, () => {});
	}
	for(let i = 0; i < bindCodes.length; i++) {
		let thisbutton = document.createElement("div");
		thisbutton.classList.add("button");
		if(bindCodes[i].slice(0, 3) == "Key") {
			thisbutton.innerHTML = bindCodes[i].slice(3);
		} else if(bindCodes[i].slice(0, 5) == "Digit") {
			thisbutton.innerHTML = bindCodes[i].slice(5);
		} else {
			thisbutton.innerHTML = bindCodes[i];
		}
		let listenForKey = (e) => {
			if(e.code.slice(0, 3) == "Key") {
				thisbutton.innerHTML = e.code.slice(3);
			} else if(e.code.slice(0, 5) == "Digit") {
				thisbutton.innerHTML = e.code.slice(5);
			} else {
				thisbutton.innerHTML = e.code;
			}
			bindCodes[i] = e.code;
			chrome.storage.local.set({keybinds: bindCodes.join(',')}, () => {});
			chrome.storage.local.get(["keybinds"], (items) => {console.log(items.keybinds.split(','));});
			document.removeEventListener("keydown", listenForKey);
		};
		thisbutton.addEventListener("click", (e) => {
			thisbutton.innerHTML = "Press a key";
			document.addEventListener("keydown", listenForKey);
		});
		document.getElementById("current-buttons").appendChild(thisbutton);
	}
});
