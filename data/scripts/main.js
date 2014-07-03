window.onload = function() {
	window.terminal = new Terminal();
	terminal.calculateSize(window.innerWidth, window.innerHeight);
	document.body.innerHTML += terminal.getBasicHTML();
	terminal.init();

	window.shell = new Shell();
	shell.output = function(text) { 
		window.terminal.output(text);
	};
	shell.main([]);
}
