var Shell = function() {
}
Shell.prototype = new Program();
Shell.prototype.prompt = "\033[36m\\t\033[0m \033[35m\\h\033[0m\033[1m:\033[0m\\w \\$ ";
Shell.prototype.username = "";
Shell.prototype.uid = -1;
Shell.prototype.hostname = "";
Shell.prototype.home = "";
Shell.prototype.directory = "/";

Shell.prototype.input = "";
Shell.prototype.inputPosition = 0;
Shell.prototype.history = [];
Shell.prototype.historyPosition = 0;

Shell.prototype.program = undefined;
Shell.prototype.lastExitCode = 0;

Shell.prototype.centeredOutput = function(text) { // does not work for ansi.sequences
	var line = "";
	for (var i = 0; i < text.length; i++) {
		line += text[i];
		if (text[i] == "\n") {
			var offset = parseInt((terminal.xSize - line.length - 1) / 2);
			var tmp = new Array(offset).join(" ");
			line = tmp + line;
			this.output(line);
			line = "";
		}
	}
	var offset = parseInt((terminal.xSize - line.length - 1) / 2);
	var tmp = new Array(offset).join(" ");
	line = tmp + line;
	this.output(line);
}
Shell.prototype.main = function(args) {
	var init = new Request("backend/init.php");
	var result = init.send(true, ret);
	result = JSON.parse(result);
	this.uid = result.uid;
	this.username = result.username;
	this.hostname = result.hostname;
	this.home = result.home;
	this.directory = result.home;

	this.output("\033[0m\033[2J\033[1;1H");

	var text = "\
 \033[31m                           (     (     \n\
 (  (            (     (    \033[33m)\\\033[31m )  )\\ )  \n\
 )\\)\033[33m)(\033[31m   ' (   ( )\\    )\\  (()/( (()/(  \n\
\033[33m((_)\033[31m()\\ )  )\\  )((_) (((_)  /(_)) /(_)) \n\
_(())\\_)()((_)((_)_  )\\___ \033[33m(_)\033[31m)  (_))   \n\
\033[34m\\ \\(\033[31m(_)\033[34m/ /| __|| _ )\033[31m((\033[34m/ __|| |   |_ _|  \n\
 \\ \\/\\/ / | _| | _ \\ | (__ | |__  | |   \n\
  \\_/\\_/  |___||___/  \\___||____||___|  \n\
";
	var tmp = text.split("\n");
	for (var i = 0; i < tmp.length; i++) {
		var tmp2 = new Array(parseInt((terminal.xSize - 40 - 1) / 2)).join(" ");
		tmp[i] = tmp2 + tmp[i];
	}
	text = tmp.join("\n") + "\n";
	this.output(text);
	this.output("\033[36m");
	this.centeredOutput("\
Welcome to Webcli\n\
=================");
	this.output("\n\n\033[0mYou are logged in as \"" + this.username + "\". Use `su` to change your user.\n\n");
	this.displayPrompt();
}
Shell.prototype.displayPrompt = function() {
	var text = this.prompt;
	while (text.indexOf("\\u") != -1)
		text = text.replace("\\u", this.username);
	while (text.indexOf("\\?") != -1)
		text = text.replace("\\?", this.lastExitCode);
	while (text.indexOf("\\h") != -1)
		text = text.replace("\\h", this.hostname);
	while (text.indexOf("\\w") != -1)
		text = text.replace("\\w", this.directory.indexOf(this.home) == 0 ? this.directory.replace(this.home, "~") : this.directory);
	while (text.indexOf("\\t") != -1)
		text = text.replace("\\t", pad(new Date().getHours()) + ":" + pad(new Date().getMinutes()));
	while (text.indexOf("\\$") != -1)
		text = text.replace("\\$", (this.uid == 1 ? "#" : "$"));
	this.output("\033[2K\033[1G" + text + this.input + "\033[" + (this.input.length - this.inputPosition) + "D");
}
Shell.prototype.handleKey = function(keyEvent) {
	if (this.porgram) {
		this.program.handleKey(keyEvent);
	}
	if (keyEvent.isSpecialKey) {
		var ke = KeyEvent.SpecialKeys;
		switch(keyEvent.key) {
		case ke.enter:
			this.output("\n");
			this.history.push(this.input);
			this.historyPosition = this.history.length;
			this.exec();
			break;
		case ke.backspace:
			if (this.inputPosition == 0)
				break;
			var tmp = this.input.split("");
			tmp.splice(--this.inputPosition, 1);
			this.input = tmp.join("");
			this.displayPrompt();
			break;
		case ke.left:
			if (this.inputPosition == 0)
				break;
			this.inputPosition--;
			this.displayPrompt();
			break;
		case ke.right:
			if (this.inputPosition == this.input.length)
				break;
			this.inputPosition++;
			this.displayPrompt();
			break;
		case ke.up:
			if (this.historyPosition == 0)
				break;
			this.input = this.history[--this.historyPosition];
			this.inputPosition = this.input.length;
			this.displayPrompt();
			break;
		case ke.down:
			if (this.historyPosition == this.history.length)
				break;
			if (this.historyPosition == this.history.length - 1) {
				this.input = "";
				this.inputPosition = 0;
				this.historyPosition = this.history.length;
				this.displayPrompt();
				break;
			}
			this.input = this.history[++this.historyPosition];
			this.inputPosition = this.input.length;
			this.displayPrompt();
			break;
		default:
			break;
		}
	} else {
		var tmp = this.input.split("");
		tmp.splice(this.inputPosition++, 0, keyEvent.key);
		this.input = tmp.join("");
		this.displayPrompt();
	}
}
Shell.prototype.exec = function() {
	var args = this.input.split(" ");
	this.input = "";
	this.inputPosition = 0;
	for (var i = 0; i < ProgramManager.programs.length; i++) {
		if (ProgramManager.programs[i].command == args[0]) {
			this.program = new ProgramManager.programs[i].code();
			this.program.init();
			this.program.exit = function(code) {
				shell.program = undefined;
				shell.lastExitCode = code;
				shell.displayPrompt();
			}
			this.program.output = function(text) {
				shell.output(text);
			}
			this.program.main(args);
			return;
		}
	}
	this.output("\033[31msh: " + args[0] + ": command not found\033[0m\n");
	this.lastExitCode = 127;
	this.displayPrompt();
}

ProgramManager.programs.push({
	command: "sh",
	code: Shell
})
