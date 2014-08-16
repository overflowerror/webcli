var Cat = function() {
}
Cat.prototype = new Program();
Cat.prototype.main = function(args) {
	if (args.length != 2) {
		this.output("\033[31m" + args[0] + ": Illegal number of arguments\033[0m\n");
		this.exit(1);
	}


	if (args[1].substring(0, 1) != "/")
		args[1] = shell.directory + "/" + args[1];

	var result = new Request("backend/cat.php");
	result.setData([["path", args[1]]]);
	result = result.send(true, ret);
	result = JSON.parse(result);

	if (result.error) {
		this.output("\033[31m" + args[0] + ": " + result.error + "\033[0m\n");
		this.exit(1);
		return;
	}

	this.output(result.content);
	if (result.content.substring(result.content.length - 1, 1) != "\n")
		this.output("\n");

	this.exit(0);
}

ProgramManager.programs.push({
	command: "cat",
	code: Cat
})
