window.onload = function() {
	window.terminal = new Terminal();
	terminal.calculateSize(window.innerWidth, window.innerHeight);
	document.body.innerHTML += terminal.getBasicHTML();
	terminal.init();
}
