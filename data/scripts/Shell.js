ProgramManager.programs.push({
	command: "sh",
	code: Shell
})

var Shell = function() {
}
Shell.prototype = new Program();
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
	
}


