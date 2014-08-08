var Hello = function() {
}
Hello.prototype = new Program();
Hello.prototype.main = function(args) {
	this.output("hello world\n");
	this.exit(0);
}

ProgramManager.programs.push({
	command: "hello",
	code: Hello
})
