var Su = function() {
}
Su.prototype = new Program();
Su.prototype.inputPosition = 0;
Su.prototype.input = "";
Su.prototype.user = "";
Su.prototype.main = function(args) {
	if (args.length != 2)
		args[1] = "root";
	this.user = args[1];
	var result = new Request("backend/su.php");
	result.setData([["check", true], ["user", args[1]]]);
	result = result.send(true, ret);
	result = JSON.parse(result);

	if (result.error) {
		this.output("\033[31m" + args[0] + ": " + result.error + "\033[0m\n");
		this.exit(1);
		return;
	}
	if (!result.okay) {
		this.output("\033[31m" + args[0] + ": Unknown error\033[0m\n");
		this.exit(2);
		return;
	}
	
	if (result.loggedIn) {
		shell.username = result.username;
		shell.uid = result.uid;
		shell.home = result.home;
		this.exit(0);
		return;
	}

	this.output("Password: ");
}
Su.prototype.handleKey = function(keyEvent) {
	if (keyEvent.isSpecialKey) {
		var ke = KeyEvent.SpecialKeys;
		switch(keyEvent.key) {
		case ke.enter:
			this.output("\n");
			this.exec();
			break;
		case ke.backspace:
			if (this.inputPosition == 0)
				break;
			var tmp = this.input.split("");
			tmp.splice(--this.inputPosition, 1);
			this.input = tmp.join("");
			break;
		case ke.left:
			if (this.inputPosition == 0)
				break;
			this.inputPosition--;
			break;
		case ke.right:
			if (this.inputPosition == this.input.length)
				break;
			this.inputPosition++;
			break;
		default:
			break;
		}
	} else {
		var tmp = this.input.split("");
		tmp.splice(this.inputPosition++, 0, keyEvent.key);
		this.input = tmp.join("");
	}
}
Su.prototype.exec = function() {
	var result = new Request("backend/su.php");
	result.setData([["password", Sha256.hash(this.input)], ["user", this.user]]);
	this.input = "";
	result = result.send(true, ret);
	result = JSON.parse(result);
	if (result.error) {
		this.output("\033[31msu: " + result.error + "\033[0m\n");
		this.exit(1);
		return;
	}
	if (!result.okay) {
		this.output("\033[31msu: Unknown error\033[0m\n");
		this.exit(2);
		return;
	}
	shell.username = result.username;
	shell.uid = result.uid;
	shell.home = result.home;
	this.exit(0);
	return;
}

ProgramManager.programs.push({
	command: "su",
	code: Su
})
