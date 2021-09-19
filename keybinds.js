bindCodes = localStorage.getItem("at-keybinds").split(',');
for(let i = 0; i < bindCodes.length; i++) {
	thisbutton = document.createElement("div");
	thisbutton.classList.add("button");
	if(bindCodes[i].slice(0, 3) == "Key") {
		thisbutton.innerHTML = bindCodes[i].slice(3);
	} else if(bindCodes[i].slice(0, 5) == "Digit") {
		thisbutton.innerHTML = bindCodes[i].slice(5);
	} else {
		thisbutton.innerHTML = bindCodes[i];
	}
	const listenForKey = (e) => {
		if(e.code.slice(0, 3) == "Key") {
			thisbutton.innerHTML = e.code.slice(3);
		} else if(e.code.slice(0, 5) == "Digit") {
			thisbutton.innerHTML = e.code.slice(5);
		} else {
			thisbutton.innerHTML = e.code;
		}
		bindCodes[i] = e.code;
		localStorage.setItem("at-keybinds", bindCodes.join(","));
		thisbutton.removeEventListener("keydown", listenForKey);
	};
	thisbutton.addEventListener("click", (e) => {
		thisbutton.innerHTML = "Press a key";
		thisbutton.addEventListener("keydown", listenForKey);
	});
	document.getElementById("current-buttons").appendChild(thisbutton);
};
