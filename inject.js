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

var rootactionset = {
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
											{title: "+5%", commands: ["volumeup", 5]},
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
											{title: "-5%", commands: ["volumeup", -5]},
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
