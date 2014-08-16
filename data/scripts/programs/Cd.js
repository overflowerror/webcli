var Cd = function() {
}
Cd.prototype = new Program();
Cd.prototype.main = function(args) {
	if (args.length != 2)
		args[1] = shell.home;

	if (args[1].substring(0, 1) != "/")
		args[1] = shell.directory + "/" + args[1];

	var result = new Request("backend/cd.php");
	result.setData([["path", args[1]]]);
	result = result.send(true, ret);
	result = JSON.parse(result);

	if (result.error) {
		this.output("\033[31m" + args[0] + ": " + result.error + "\033[0m\n");
		this.exit(1);
		return;
	}

	shell.directory = result.path;

	this.exit(0);
}

ProgramManager.programs.push({
	command: "cd",
	code: Cd
})
