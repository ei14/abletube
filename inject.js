var keys = ["KeyQ", "KeyW"];

/*

Actionsets have 3 properties:
	cursor, boolean - Determines if a scanning cursor should be shown
	actions, array - Lists the Actions that will be shown in this Actionset
	responses, array - List of Commands. Decides how each different button pressed should select an action or move the cursor
Actions have 2 properties:
	title, string - The title to be shown to the user
		special values are enclosed in curly braces
			{R#}
				Replaces the title with the title of the #th recommended video
			{T}
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

	playpause() - Plays or pauses the video
	fullscreen() - Toggles fullscreen
	recommended(video) - Goes to the "video"th next video in recommended
	volumeup(amount) - Changes the volume by "amount" (set negative to lower volume)

*/

var rootactionset = {
	cursor: false,
	actions: [
		{
			title: "Control video",
			commands: [["actionset", {
				cursor: true,
				actions: [
					{title: "Play / Pause", commands: [["playpause", -1], ["reset"]]},
					{title: "Fullscreen", commands: [
						["fullscreen", 1],
						["actionset", {
							cursor: false,
							actions: [{title: "Exit Fullscreen", commands: [["fullscreen", 0], ["reset"]]}],
							responses: [["select", 0], ["select", 0]]
						}]
					]},
					{
						title: "Change volume",
						commands: [["actionset", {
							cursor: false,
							actions: [
								{
									title: "Decrease volume",
									commands: [["actionset", {
										cursor: false,
										actions: [
											{title: "-10%", commands: [["volumeup", -10]]},
											{title: "Exit", commands: [["reset"]]},
										],
										responses: [["select", 0], ["select", 1]]
									}]]
								},
								{
									title: "Increase volume",
									commands: [[ "actionset", {
										cursor: false,
										actions: [
											{title: "+10%", commands: [["volumeup", 10]]},
											{title: "Exit", commands: [["reset"]]},
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
			title: "Go to",
			commands: [["actionset", {
				cursor: true,
				actions: [
					{title: "Home screen", commands: [["goto", "https://youtube.com"]]},
					{title: "Subscriptions", commands: [["goto", "https://youtube.com/feed/subscriptions"]]},
					{title: "Recommended videos", commands: [["actionset", {
						cursor: true,
						actions: [
							{title: "{R0}", commands: [["recommended", 0], ["reset"]]},
							{title: "{R1}", commands: [["recommended", 1], ["reset"]]},
							{title: "{R2}", commands: [["recommended", 2], ["reset"]]},
							{title: "{R3}", commands: [["recommended", 3], ["reset"]]},
							{title: "Cancel", commands: [["reset"]]},
						],
						responses: [["select", 0], ["move", 1]]
					}]]},
					{title: "Cancel", commands: [["reset"]]},
				],
				responses: [["select", 0], ["move", 1]]
			}]]
		}
	],
	responses: [["select", 0], ["select", 1]]
};
var homeactionset = {
	cursor: true,
	actions: [
		{title: "{R0}", commands: [["recommended", 0], ["actionset", rootactionset], ["refresh"]]},
		{title: "{R1}", commands: [["recommended", 1], ["actionset", rootactionset], ["refresh"]]},
		{title: "{R2}", commands: [["recommended", 2], ["actionset", rootactionset], ["refresh"]]},
		{title: "{R3}", commands: [["recommended", 3], ["actionset", rootactionset], ["refresh"]]},
		{title: "Next page", commands: [["actionset", {
			cursor: true,
			actions: [
				{title: "{R4}", commands: [["recommended", 4], ["actionset", rootactionset], ["refresh"]]},
				{title: "{R5}", commands: [["recommended", 5], ["actionset", rootactionset], ["refresh"]]},
				{title: "{R6}", commands: [["recommended", 6], ["actionset", rootactionset], ["refresh"]]},
				{title: "{R7}", commands: [["recommended", 7], ["actionset", rootactionset], ["refresh"]]},
				{title: "Next page", commands: [["actionset", {
					cursor: true,
					actions: [
						{title: "{R8}", commands: [["recommended", 8], ["actionset", rootactionset], ["refresh"]]},
						{title: "{R9}", commands: [["recommended", 9], ["actionset", rootactionset], ["refresh"]]},
						{title: "{R10}", commands: [["recommended", 10], ["actionset", rootactionset], ["refresh"]]},
						{title: "{R11}", commands: [["recommended", 11], ["actionset", rootactionset], ["refresh"]]},
						{title: "First page", commands: [["reset"]]},
					],
					responses: [["select", 0], ["move", 1]]
				}]]},
			],
			responses: [["select", 0], ["move", 1]]
		}]]},
	],
	responses: [["select", 0], ["move", 1]]
};

var buttonset;
setTimeout(() => {
	buttonset = document.createElement("div");
	buttonset.id = "actionset";
	const pageContent = document.getElementById("primary");
	pageContent.insertBefore(buttonset, pageContent.firstChild);

	execCommand(["reset"]);
}, 100);

setInterval(() => {
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
	if(document.getElementById("chips-wrapper")) document.getElementById("chips-wrapper").remove();

	console.log(localStorage.getItem("at-keybinds"));
	keys = localStorage.getItem("at-keybinds").split(',');
}, 1000);

var cursor = 0;
var displayCursor = false;
var currentactionset = rootactionset;

const clamp = (a, x, b) => {
	// Returns x clamped between a and b
	if(x < a) return a;
	if(x > b) return b;
	return x;
}

const parseTitle = (str) => {
	let title = str;
	while(title.includes("{") && title.indexOf("{") < title.indexOf("}")) {
		let openbrace = title.indexOf("{");
		let closebrace = title.indexOf("}");
		let macro = title.slice(openbrace + 1, closebrace);
		switch(macro.charAt(0)) {
			case 'R':
				title =
					title.slice(0, openbrace)
					+ document.querySelectorAll("[id='video-title']")[parseInt(macro.slice(1))].innerHTML.trim()
					+ title.slice(closebrace + 1); case 'T': // TODO: get current title break;
		}
	}
	return title;
};

const createButton = (action) => {
	let button = document.createElement("div");
	button.classList.add("action");
	button.innerHTML = parseTitle(action.title);
	return button;
};

const loadActionSet = (set) => {
	while(buttonset.firstChild) {
		buttonset.removeChild(buttonset.firstChild);
	}
	set.actions.forEach(action => {
		buttonset.appendChild(createButton(action));
	});
	if(set.cursor) {
		buttonset.firstChild.classList.add("cursored");
	}
	currentactionset = set;
	cursor = 0;
}

var initialInputs = false;

const execCommand = (args) => {
	var player;
	if(document.getElementById("ytd-player")) {
		player = document.getElementById("ytd-player").player_;
	}
	switch(args[0]) {
		case "actionset":
			loadActionSet(args[1]);
			break;
		case "reset":
			if(window.location.href.split("com")[1].includes("feed/subscriptions")) {
				loadActionSet(homeactionset);
			} else if(window.location.href.split("com")[1].length > 1) {
				loadActionSet(rootactionset);
			} else {
				loadActionSet(homeactionset);
			}
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
		case "recommended":
			const reccvids = document.querySelectorAll("ytd-thumbnail");
			window.location.href = reccvids[args[1]].querySelector("a").href;
			break;
		case "goto":
			window.location.href = args[1];
			break;
		case "refresh":
			setTimeout(() => {
				//window.location.reload();
			}, 1);
			break;
	}
}

const execResponse = (args) => {
	switch(args[0]) {
		case "select":
			currentactionset.actions[cursor + args[1]].commands.forEach(command => {
				execCommand(command);
			});
			break;
		case "move":
			const buttons = buttonset.getElementsByClassName("action");
			buttons[cursor].classList.remove("cursored");
			cursor = (cursor + args[1]) % buttons.length;
			buttons[cursor].classList.add("cursored");
			break;
	}
}

window.addEventListener("keydown", (e) => {
	if(!initialInputs) {
		initialInputs = true;
		//execCommand(["fullscreen", 1]);
		//console.log("INIT");
	}
	for(let i = 0; i < keys.length; i++) {
		if(e.code == keys[i]) {
			execResponse(currentactionset.responses[i]);
			break;
		}
	}
});

