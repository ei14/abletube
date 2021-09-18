var playing = true;
window.addEventListener("keydown", (e) => {
	const playbutton = document.getElementsByClassName("ytp-button ytp-play-button")[0];
	const fullscreenbutton = document.getElementsByClassName("ytp-button ytp-fullscreen-button")[0];
	const upnext = document.getElementsByClassName("ytd-thumbnail")[0];

	if(e.keyCode == 81) {
		playbutton.click();
		if(playing) {
			if(fullscreenbutton.getAttribute("aria-label").charAt(0) != 'F') {
				fullscreenbutton.click();
			}
		} else {
			if(fullscreenbutton.getAttribute("aria-label").charAt(0) != 'E') {
				fullscreenbutton.click();
			}
		}
		playing = !playing;
	}
	if(e.keyCode == 87) {
		upnext.click();
	}
});
