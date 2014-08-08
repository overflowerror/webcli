var Ls = function() {
}
Ls.prototype = new Program();
Ls.prototype.main = function(args) {
	var result = new Request("backend/ls.php");
	result.setData([["path", args.length > 1 ? args[1] : shell.directory]]);
	result = result.send(true, ret);
	result = JSON.parse(result);
	var spaces = [10, -0, -0, -0, -0, 12, -0];
	for (var i = 0; i < result.length; i++) {
		if (result[i].hardlinks.length > spaces[1])
			spaces[1] = result[i].hardlinks.length;
		if (result[i].owner.length > spaces[2])
			spaces[2] = result[i].owner.length;
		if (result[i].group.length > spaces[3])
			spaces[3] = result[i].group.length;
		if (result[i].size.length > spaces[4])
			spaces[4] = result[i].size.length;
		if (result[i].name.length > spaces[4])
			spaces[4] = result[i].name.length;
	}
	for (var i = 0; i < result.length; i++) {
		this.output(result[i].permission + " ");
		for (var j = 0; j < spaces[1] - result[i].hardlinks.length; j++)
			this.output(" ");
		this.output(result[i].hardlinks + " ");
		this.output(result[i].owner);
		for (var j = 0; j < spaces[3] - result[i].owner.length; j++)
			this.output(" ");
		this.output(result[i].group);
		for (var j = 0; j < spaces[3] - result[i].group.length; j++)
			this.output(" ");
		for (var j = 0; j < spaces[2] - result[i].size.length; j++)
			this.output(" ");
		this.output(result[i].size + " ");
		this.output(this.formatTime(parseInt(result[i].changed)) + " ");
		this.output(result[i].name + "\n");
	}
	this.exit(0);
}
Ls.prototype.formatTime = function(time) {
	var tmp = "";
	var date = new Date (time * 1000);
	switch(date.getMonth()) {
	case 0:
		tmp += "Jan";
		break;
	case 1:
		tmp += "Feb";
		break;
	case 2:
		tmp += "Mar";
		break;
	case 3:
		tmp += "Apr";
		break;
	case 4:
		tmp += "May";
		break;
	case 5:
		tmp += "Jun";
		break;
	case 6:
		tmp += "Jul";
		break;
	case 7:
		tmp += "Aug";
		break;
	case 8:
		tmp += "Sep";
		break;
	case 9:
		tmp += "Oct";
		break;
	case 10:
		tmp += "Nov";
		break;
	case 11:
		tmp += "Dev";
		break;
	}
	tmp += " ";
	if (date.getDate() < 10)
		tmp += " ";
	tmp += date.getDate();
	tmp += " ";
	tmp += pad(date.getHours());
	tmp += ":";
	tmp += pad(date.getMinutes());
	return tmp;
}


ProgramManager.programs.push({
	command: "ls",
	code: Ls
})
