var Event = function() {
}

var KeyEvent = function() {
}
KeyEvent.SpecialKeys = {
	non      : 0, 
	up       : 1, 
	down     : 2,
	left     : 3, 
	right    : 4, 
	esc      : 5, 
	enter    : 6, 
	backspace: 7, 
	del      : 8
};
KeyEvent.prototype = new Event();
KeyEvent.prototype.char = "";
KeyEvent.prototype.specialKey = KeyEvent.SpecialKeys.non;
KeyEvent.prototype.modifier = {
	ctrl : false,
	meta : false,
	alt  : false,
	altgr: false
}
