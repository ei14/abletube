bindCodes = cooki.getItem("at-keybinds").split(',');
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
		console.log(e.code);
		if(e.code.slice(0, 3) == "Key") {
			thisbutton.innerHTML = e.code.slice(3);
		} else if(e.code.slice(0, 5) == "Digit") {
			thisbutton.innerHTML = e.code.slice(5);
		} else {
			thisbutton.innerHTML = e.code;
		}
		bindCodes[i] = e.code;
		localStorage.setItem("at-keybinds", bindCodes.join(","));
		document.removeEventListener("keydown", listenForKey);
	};
	thisbutton.addEventListener("click", (e) => {
		thisbutton.innerHTML = "Press a key";
		document.addEventListener("keydown", listenForKey);
	});
	document.getElementById("current-buttons").appendChild(thisbutton);
};
