var Whoami = function() {
}
Whoami.prototype = new Program();
Whoami.prototype.main = function(args) {
	this.output(shell.username + "\n");
	this.exit(0);
}

ProgramManager.programs.push({
	command: "whoami",
	code: Whoami
})
