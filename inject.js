/*

Actionsets have 3 properties:
	cursor, boolean - Determines if a scanning cursor should be shown
	actions, array - Lists the Actions that will be shown in this Actionset
	responses, array - List of Commands. Decides how each different button pressed should select an action or move the cursor
Actions have 2 properties:
	title, string - The title to be shown to the user
		special values are enclosed in curly braces
			{REC#}
				Replaces the title with the title of the #th reccomended video
			{THIS}
				Replaces the title with the title of the current video
	commands, array - A list of Commands to be executed upon selection of the action
Commands are arrays with at least 1 element:
	name, string - The command being executed
	Further arguments are optionally included

List of commands:
	actionset(set) - Loads up the actionset "set" to be displayed and used next
	reset() - Loads the starting actionset

	select(offset) - Executes the command at offset "offset" from the cursor in the currently loaded Actionset
	move(distance) - Moves the cursor by distance "distance"

	playvideo() - Plays or pauses the video
	fullscreen() - Toggles fullscreen
	nextvideo(video) - Goes to the "video"th next video in reccomended
	volumeup(amount) - Changes the volume by "amount" (set negative to lower volume)

*/

const rootactionset = {
	cursor: false,
	actions: [
		{
			title: "Control video",
			commands: [["actionset", {
				cursor: true,
				actions: [
					{title: "Play / Pause", commands: [["playvideo"], ["fullscreen"]]},
					{title: "Next video", commands: [["nextvideo", 0]]},
					{
						title: "Change volume",
						commands: [["actionset", {
							cursor: false,
							actions: [
								{
									title: "Increase volume",
									commands: [[ "actionset", {
										cursor: false,
										actions: [
											{title: "+10%", commands: ["volumeup", 5]},
											{title: "Exit", commands: ["reset"]},
										],
										responses: [["select", 0], ["select", 1]]
									}]]
								},
								{
									title: "Decrease volume",
									commands: [["actionset", {
										cursor: false,
										actions: [
											{title: "-10%", commands: ["volumeup", -5]},
											{title: "Exit", commands: ["reset"]},
										],
										responses: [["select", 0], ["select", 1]]
									}]]
								}
							],
							responses: [["select", 0], ["select", 1]]
						}]],
					},
					{title: "Main Menu", commands: [["reset"]]},
				],
				responses: [["select", 0], ["move", 1]]
			}]]
		},
		{
			title: "Select new video",
			commands: [["actionset", {
				cursor: true,
				actions: [
					{title: "{REC0}", commands: [["nextvideo", 0]]},
					{title: "{REC1}", commands: [["nextvideo", 1]]},
					{title: "{REC2}", commands: [["nextvideo", 2]]},
					{title: "Cancel", commands: [["reset"]]},
				],
				responses: [["select", 0], ["move", 1]]
			}]]
		}
	],
	responses: [["select", 0], ["select", 1]]
};

setInterval(() => {
	console.log("HI");
	const player = document.getElementById("ytd-player").player_;
	if(player) {
		const skipAd = document.getElementsByClassName("ytp-ad-skip-button");
		if(skipAd.length) {
			skipAd[0].click();
		}
		const closeOverlay = document.getElementsByClassName("ytp-ad-overlay-close-button");
		if(closeOverlay.length) {
			closeOverlay[0].click();
		}
	}
}, 3000);

var cursor = 0;
var displayCursor = false;

const clamp = (a, x, b) => {
	// Returns x clamped between a and b
	if(x < a) return a;
	if(x > b) return b;
	return x;
}

const loadActionSet = (set) => {
	// TODO
}

const execCommand = (args) => {
	const player = document.getElementById("ytd-player").player_;
	switch(args[0]) {
		case "actionset":
			loadActionSet(args[1]);
			break;
		case "reset":
			loadActionSet(rootactionset);
			break;
		case "playpause":
			switch(args[1]) {
				case 1:
					player.playVideo();
					break;
				case 0:
					player.pauseVideo();
					break;
				case -1:
					if(player.getPlayerState() == 1) {
						player.pauseVideo();
					} else if(player.getPlayerState() == 2) {
						player.playVideo();
					}
					break;
			}
			break;
		case "fullscreen":
			switch(args[1]) {
				case 1:
					if(!player.isFullscreen()) player.toggleFullscreen();
					break;
				case 0:
					if(player.isFullscreen()) player.toggleFullscreen();
					break;
				case -1:
					player.toggleFullscreen();
					break;
			}
			break;
		case "volumeup":
			player.setVolume(clamp(0, player.getVolume() + args[1], 100));
			break;
		case "reccomended":
			const reccvids = document.getElementsByClassName("ytd-thumbnail");
			reccvids[args[1]].click();
			break;
	}
}

console.log("INIT");
buttonset = document.createElement("div");
buttonset.id = "actionset";

buttonOne = document.createElement("div");
buttonOne.classList.add("action");
buttonset.appendChild(buttonOne);

buttonTwo = document.createElement("div");
buttonTwo.classList.add("action");
buttonset.appendChild(buttonTwo);

const pageContent = document.getElementById("primary");
pageContent.insertBefore(buttonset, pageContent.firstChild);
console.log("FIN");

window.addEventListener("keydown", (e) => {
	const player = document.getElementById("ytd-player").player_;
	const upnext = document.getElementsByClassName("ytd-thumbnail")[0];

	if(e.code == "KeyQ") {
		if(player.getPlayerState() == 1) { // Playing
			execCommand(["playpause", 0]);
			execCommand(["fullscreen", 0]);
		} else if(player.getPlayerState() == 2) { // Paused
			execCommand(["playpause", 1]);
			execCommand(["fullscreen", 1]);
		}
	}
	if(e.code == "KeyW") {
		upnext.click();
	}
});

