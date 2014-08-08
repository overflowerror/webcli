window.onload = function() {
	window.terminal = new Terminal();
	terminal.calculateSize(window.innerWidth, window.innerHeight);
	document.body.innerHTML += terminal.getBasicHTML();
	terminal.init();

	window.shell = new Shell();
	shell.exit = function(code) {
		console.log("shell killed with status code " + code);
		console.log("restarting shell");
		onload();
	}
	shell.output = function(text) { 
		terminal.output(text);
	};
	terminal.keyEvent = function (keyEvent) {
		shell.handleKey(keyEvent);
	};
	shell.main([]);
}
