ProgramManager.programs.push({
	command: "sh",
	code: Shell
})

var Shell = function() {
}
Shell.prototype = new Program();
Shell.prototype.prompt = "\033[36m\\t\033[0m \033[35m\\h\033[0m\033[1m:\033[0m\\w \\$ ";
Shell.prototype.user = "nobody";
Shell.prototype.hostname = "webcli";
Shell.prototype.directory = "/";
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
	this.output("\n\n\033[0mYou are logged in as \"nobody\". Use `su` to change your user.\n\033[31mNo directory, logging in with HOME=/\033[0m\n\n");
	this.displayPrompt();
}
Shell.prototype.displayPrompt = function() {
	var text = this.prompt;
	console.dir(this);
	while (text.indexOf("\\u") != -1)
		text = text.replace("\\u", this.user);
	while (text.indexOf("\\h") != -1)
		text = text.replace("\\h", this.hostname);
	while (text.indexOf("\\w") != -1)
		text = text.replace("\\w", this.directory);
	while (text.indexOf("\\t") != -1)
		text = text.replace("\\t", new Date().getHours() + ":" + new Date().getMinutes());
	while (text.indexOf("\\$") != -1)
		text = text.replace("\\$", (this.user == "root" ? "#" : "$"));
	this.output(text);
}

