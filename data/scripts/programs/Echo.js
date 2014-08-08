var Echo = function() {
}
Echo.prototype = new Program();
Echo.prototype.main = function(args) {
	args.splice(0, 1);
	this.output(args.join(" ") + "\n");
	this.exit(0);
}

ProgramManager.programs.push({
	command: "echo",
	code: Echo
})
