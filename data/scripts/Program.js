var ProgramManager = function() {
}
ProgramManager.programs = [];
ProgramManager.instanceCounter = 1;
ProgramManager.instances = [];

var Program = function() {
}
Program.prototype.pid;
Program.prototype.init = function() { // Do not overwrite
	this.pid = ProgramManager.instanceCounter++;
	ProgramManager.instances.push(this);
}
Program.prototype.main = function(args) {
}
Program.prototype.output = function(text) {
}
Program.prototype.keyHandler = function(keyEvent) {
}
