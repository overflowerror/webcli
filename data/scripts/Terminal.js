const TERM_X_MIN = 60;
const TERM_Y_MIN = 10;
// the following 2 values are empirical determined in chromium
const TERM_CELL_HEIGHT = 16; 
const TERM_CELL_WIDTH  = 8;

const ANSI_NO   = 0;
const ANSI_ESC  = 1;
const ANSI_CSI1 = 2;
const ANSI_CSI2 = 3;
const ANSI_CSI3 = 4;
const ANSI_CUU  = 5;
const ANSI_CUD  = 6;
const ANSI_CUF  = 7;
const ANSI_CUB  = 8;
const ANSI_CNL  = 9;
const ANSI_CPL  = 10;
const ANSI_CHA  = 11;
const ANSI_CUP  = 12;
const ANSI_ED   = 13;
const ANSI_EL   = 14;
const ANSI_SCP  = 15;
const ANSI_RCP  = 16;
const ANSI_DECTCEM = 17;
const ANSI_DSR  = 18;
const ANSI_SGR  = 19;

var Terminal = function() {
}
Terminal.prototype.xSize;
Terminal.prototype.ySize;
Terminal.prototype.xPosition = 0;
Terminal.prototype.yPosition = 0;
Terminal.prototype.xPositionSaved = 0;
Terminal.prototype.yPositionSaved = 0;
Terminal.prototype.tickId;

Terminal.prototype.staticNoShift = 0;
Terminal.prototype.color = "white";
Terminal.prototype.backgroundColor = "black";
Terminal.prototype.bold = false;
Terminal.prototype.displayCursor = true;

Terminal.prototype.calculateSize = function(width, height) {
	this.xSize = parseInt(width / (TERM_CELL_WIDTH));
	if (this.xSize < TERM_X_MIN)
		this.xSize = TERM_X_MIN;
	this.ySize = parseInt(height / (TERM_CELL_HEIGHT));
	if (this.ySize < TERM_Y_MIN)
		this.ySize = TERM_Y_MIN;

	console.log("Terminal resolution is: " + this.xSize + "x" + this.ySize);
}
Terminal.prototype.getBasicHTML = function() {
	var code = "";
	code += "<table>";
	for (var i = 0; i < this.ySize; i++) {
		code += "<tr id=\"r" + i + "\">";
		for (var j = 0; j < this.xSize; j++)
			code += "<td class=\"" + i + "c" + j + "\"> </td>"
		code += "</tr>";
	}
	code += "</table>";
	code += this.getInputHTML();
	return code;
}
Terminal.prototype.getInputHTML = function() {
	var code = "\
		<form id=\"form\" name=\"form\" onsubmit=\"return false;\">\
			<input onblur=\"window.setTimeout(function() { document.getElementById('input').focus();}, 1);\" type=\"text\" name=\"input\" id=\"input\" />\
		</form>";
	return code;
}
Terminal.prototype.init = function() {
	window.onkeydown = this.handleKeyDown;
	window.onkeypress = this.handleKeyPress;
	this.tickId = window.setInterval(this.tick, 10);
	document.getElementById("input").focus();
	this.cursorOn();
}
Terminal.prototype.tick = function() {

}
Terminal.prototype.globalLineFeed = function() {
	for (var i = this.staticNoShift + 1; i < this.ySize; i++) {
		for (var j = 0; j < this.xSize; j++) {
			var to = document.getElementsByClassName((i - 1) + "c" + j)[0];
			var from = document.getElementsByClassName(i + "c" + j)[0];
			to.innerHTML = from.innerHTML;
			to.style.color = from.style.color;
			to.style.fontWeight = from.style.fontWeight;
			to.style.backgroundColor = from.style.backgroundColor;
		}
	}
	for (var j = 0; j < this.xSize; j++) {
		var to = document.getElementsByClassName((this.ySize - 1) + "c" + j)[0];
		to.innerHTML = " ";
		to.style.color = this.color;
		to.style.backgroundColor = this.backgroundColor;
		if (this.bold) {
			to.style.fontWeight = "bold";
		} else {
			to.style.fontWeight = "normal";
		}
	}
	if (--this.yPosition < 0)
		this.yPosition = 0;
}
Terminal.prototype.cursorOff = function() {
	var cell = document.getElementById("cursor");
	if (cell != undefined) {
		cell.style.borderColor = this.backgroundColor;
		cell.id = undefined;
	}	
}
Terminal.prototype.cursorOn = function() {
	var cell = document.getElementsByClassName(this.yPosition + "c" + this.xPosition)[0];
	if (this.displayCursor) {
		cell.style.borderColor = this.color;
		cell.id = "cursor";
	}
}

Terminal.prototype.normalOutputChar = function(char) {
	this.cursorOff();
	if (char == "\n") {
		if (++this.yPosition >= this.ySize)
			this.globalLineFeed();
		this.xPosition = 0;
	} else {
		var cell = document.getElementsByClassName(this.yPosition + "c" + this.xPosition++)[0];
		cell.innerHTML = char;
		if (this.bold)
			cell.style.fontWeight = "bold";
		else
			cell.style.fontWeight = "normal";
		cell.style.color = this.color;
		cell.style.backgroundColor = this.backgroundColor;
		cell.style.boderColor = this.backgroundColor;

		if (this.xPosition >= this.xSize) {
			this.xPosition = 0;
			this.yPosition++;
		}
		if (this.yPosition >= this.ySize) {
			this.globalLineFeed();
		}
	}
	this.cursorOn();
}
Terminal.prototype.normalOutput = function(text) {
	for (var i = 0; i < text.length; i++) {
		this.normalOutputChar(text.charAt(i));
	}
}
Terminal.prototype.output = function(text) {
	var tmp = "";
	var param1 = "";
	var param2 = "";
	var state = ANSI_NO;
	for (var i = 0; i < text.length; i++) {
		switch(state) {
		case ANSI_NO: // normal text
			if (text[i] == "\033")
				state = ANSI_ESC; // maybe a ANSI-sequence
			else
				this.normalOutputChar(text[i]);
			break;
		case ANSI_ESC:
			if (text[i] == "[")
				state = ANSI_CSI1; // maybe a CSI-sequence
			else {
				this.normalOutputChar("\033");
				state = ANSI_NO;
			}
			break;
		case ANSI_CSI1:
			if (isNumber(text[i])) {
				param1 += text[i];
				break;
			}
			if (param1.length > 0 && text[i] == ";") {
				tmp = ";"
				state = ANSI_CSI2;
				break;
			}			
			if (param1.length > 0) {
				state = ANSI_CSI3;
				i--;
				break;
			}
			if (text[i] == "?") {
				state = ANSI_DECTCEM;
				i--;
				break;
			}
			if (text[i] == "s") {
				state = ANSI_SCP;
				i--;
				break;
			}
			if (text[i] == "u") {
				state = ANSI_RCP;
				i--;
				break;
			}
			if (text[i] == "J") {
				state = ANSI_ED;
				i--;
				if (param1.length == 0)
					param1 = "0";
				break;
			}
			this.normalOutput("\033[" + param1 + text[i])
			param1 = "";
			state = ANSI_NO;
			break;
		case ANSI_CSI2:
			if (isNumber(text[i])) {
				param2 += text[i];
				break;
			}
			if (param2.length > 0) {
				i--;
				state = ANSI_CSI3;
				break;
			}
			this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
			param1 = "";
			tmp = "";
			param2 = "";
			state = ANSI_NO;
			break;
		case ANSI_CSI3:
			switch(text[i--]) {
			case "A":
				state = ANSI_CUU;
				break;
			case "B":
				state = ANSI_CUD;
				break;
			case "C":
				state = ANSI_CUF;
				break;
			case "D":
				state = ANSI_CUB;
				break;
			case "E":
				state = ANSI_CNL;
				break;
			case "F":
				state = ANSI_CPL;
				break;
			case "G":
				state = ANSI_CHA;
				break;
			case "H":
				state = ANSI_CUP;
				break;
			case "J":
				state = ANSI_ED;
				break;
			case "K":
				state = ANSI_EL;
				break;
			case "m":
				state = ANSI_SGR;
				break;
			case "n":
				state = ANSI_DSR;
				break;
			default:
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[++i]);
				param1 = "";
				param2 = "";
				tmp = "";
			}
			break;
		case ANSI_CUU:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.yPosition -= parseInt(param1);
			if (this.yPosition < 0)
				this.yPosition = 0;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_CUD:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.yPosition += parseInt(param1);
			if (this.yPosition >= this.ySize)
				this.yPosition = this.ySize - 1;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_CUF:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.xPosition += parseInt(param1);
			if (this.xPosition >= this.xSize)
				this.xPosition = this.xSize - 1;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_CUB:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.xPosition -= parseInt(param1);
			if (this.xPosition < 0)
				this.xPosition = 0;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_CNL:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.xPosition = 0;
			this.yPosition += parseInt(param1);
			if (this.yPosition >= this.ySize)
				this.yPosition = this.ySize - 1;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_CPL:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.xPosition = 0;
			this.yPosition -= parseInt(param1);
			if (this.yPosition < 0)
				this.yPosition = 0;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_CHA:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.xPosition = parseInt(param1) - 1;
			if (this.xPosition >= this.xSize)
				this.xPosition = this.xSize - 1;
			if (this.xPosition < 0)
				this.xPosition = 0;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_CUP:
			if (tmp == "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			this.cursorOff();
			this.xPosition = parseInt(param2) - 1;
			if (this.xPosition >= this.xSize)
				this.xPosition = this.xSize - 1;
			if (this.xPosition < 0)
				this.xPosition = 0;
			this.yPosition = parseInt(param1) - 1;
			if (this.yPosition >= this.ySize)
				this.yPosition = this.ySize - 1;
			if (this.yPosition < 0)
				this.yPosition = 0;
			this.cursorOn();
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_ED:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			switch (parseInt(param1)) {
			case 0:
				var x = this.xPosition;
				var y = this.yPosition;
				var string = "";
				for (var j = 0; j < this.xSize * (this.ySize - j - 1) + this.xSize - x; j++)
					string += " ";
				this.normalOutput(string);
				this.xPosition = x;
				this.yPosition = y;
				this.cursorOff();
				this.cursorOn();
				break;
			case 1:
				var x = this.xPosition;
				var y = this.yPosition;
				var string = "";
				for (var j = 0; j < this.xSize * (y - 1) + x; j++)
					string += " ";
				this.xPosition = 0;
				this.yPosition = 0;
				this.normalOutput(string);
				this.xPosition = x;
				this.yPosition = y;
				this.cursorOff();
				this.cursorOn();
				break;
			case 2:
				var x = this.xPosition;
				var y = this.yPosition;
				var string = "";
				for (var j = 0; j < this.xSize * this.ySize; j++)
					string += " ";
				this.xPosition = 0;
				this.yPosition = 0;
				this.normalOutput(string);
				this.xPosition = x;
				this.yPosition = y;
				this.cursorOff();
				this.cursorOn();
				break;
			default:
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
			}
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_EL:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			switch (parseInt(param1)) {
			case 0:
				var x = this.xPosition;
				var y = this.yPosition;
				var string = "";
				for (var j = 0; j < this.xSize - x - 1; j++)
					string += " ";
				this.normalOutput(string);
				this.xPosition = x;
				this.yPosition = y;
				this.cursorOff();
				this.cursorOn();
				break;
			case 1:
				var x = this.xPosition;
				var string = "";
				for (var j = 0; j < x - 1; j++)
					string += " ";
				this.xPosition = 0;
				this.normalOutput(string);
				this.xPosition = x;
				this.cursorOff();
				this.cursorOn();
				break;
			case 2:
				var x = this.xPosition;
				var y = this.yPosition;
				var string = "";
				for (var j = 0; j < this.xSize - 1; j++)
					string += " ";
				this.xPosition = 0;
				this.normalOutput(string);
				this.xPosition = x;
				this.yPosition = y;
				this.cursorOff();
				this.cursorOn();
				break;
			default:
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
			}
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		case ANSI_SCP:
			state = ANSI_NO;
			this.xPositionSaved = this.xPosition;
			this.yPositionSaved = this.yPosition;
			break;
		case ANSI_RCP:
			state = ANSI_NO;
			this.xPosition = this.xPositionSaved;
			this.yPosition = this.yPositionSaved;
			break;
		case ANSI_DECTCEM:
			tmp += text[i];
			if (tmp.length < 4)
				break;
			if (tmp == "?25l") {
				this.displayCursor = false;
				tmp = "";
				state = ANSI_NO;
			}
			if (tmp == "?25h") {
				this.displayCursor = true;
				tmp = "";
				state = ANSI_NO;
			}
			break;
		case ANSI_SGR:
			if (tmp != "") {
				state = ANSI_NO;
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
				param1 = "";
				param2 = "";
				tmp = "";
				break;
			}
			switch(param1) {
			case "0":
				this.color = "white";
				this.backgroundColor = "black";
				this.bold = false;
				break;
			case "1":
				this.bold = true;
				break;
			case "30":
				this.color = "black";
				break;
			case "31":
				this.color = "red";
				break;
			case "32":
				this.color = "green";
				break;
			case "33":
				this.color = "yellow";
				break;
			case "34":
				this.color = "blue";
				break;
			case "35":
				this.color = "magenta";
				break;
			case "36":
				this.color = "cyan";
				break;
			case "37":
				this.color = "white";
				break;
			case "40":
				this.backgroundColor = "black";
				break;
			case "41":
				this.backgroundColor = "red";
				break;
			case "42":
				this.backgroundColor = "green";
				break;
			case "43":
				this.backgroundColor = "yellow";
				break;
			case "44":
				this.backgroundColor = "blue";
				break;
			case "45":
				this.backgroundColor = "magenta";
				break;
			case "46":
				this.backgroundColor = "cyan";
				break;
			case "47":
				this.backgroundColor = "white";
				break;
			default:
				this.normalOutput("\033[" + param1 + tmp + param2 + text[i]);
			}
			state = ANSI_NO;
			param1 = "";
			param2 = "";
			tmp = "";
			break;
		}
	}
	if (tmp.length || param1.length || param2.length)
		this.normalOutput("\033[" + param1 + tmp + param2);
}
Terminal.prototype.keyEvent = function(keyEvent) {
}
Terminal.prototype.handleKeyDown = function(e) {
	var key = new KeyEvent();
	key.isSpecialKey = true;
	switch(e.keyIdentifier) {
	/*case "Enter":
		key.key = KeyEvent.SpecialKeys.enter;
		break;*/
	case "U+0008":
		key.key = KeyEvent.SpecialKeys.backspace;
		break;
	case "Up":
		key.key = KeyEvent.SpecialKeys.up;
		break;
	case "Down":
		key.key = KeyEvent.SpecialKeys.down;
		break;
	case "Left":
		key.key = KeyEvent.SpecialKeys.left;
		break;
	case "Right":
		key.key = KeyEvent.SpecialKeys.right;
		break;
	case "U+001B":
		key.key = KeyEvent.SpecialKeys.esc;
		break;
	case "U+007F":
		key.key = KeyEvent.SpecialKeys.del;
		break;
	default:
		return;
	}
	key.modifier = {
		ctrl : e.ctrlKey,
		meta : e.metaKey,
		alt  : e.altKey,
		altgr: e.altGraphKey
	}
	terminal.keyEvent(key);
	return false;
}
Terminal.prototype.handleKeyPress = function(e) {
	var key = new KeyEvent();
	if (e.keyIdentifier == "Enter") {
		key.isSpecialKey = true;
		key.key = KeyEvent.SpecialKeys.enter;
	} else {
		key.isSpecialKey = false;
		key.key = String.fromCharCode(e.which);
	}
	key.modifier = {
		ctrl : e.ctrlKey,
		meta : e.metaKey,
		alt  : e.altKey,
		altgr: e.altGraphKey
	}
	terminal.keyEvent(key);
	return false;
}
