var Request = function(file, type) {
	if (type)
		this.type = type;
	if (file)
		this.file = file;
}
Request.prototype.type = "GET";
Request.prototype.file = "";
Request.prototype.data = "";
Request.prototype.setData = function(array) {
	for (var i = 0; i < array; i++) {
		this.data += (this.data.length == 0 ? "" : "&") + encodeURIComponent(array[i]);
	}
}
Request.prototype.send = function(synchron, after) {
	var http = new XMLHttpRequest();
	if (this.type == "GET") {
		http.open("GET", this.file + "?" + this.data, !synchron);
	} else if (this.type == "POST") {
		http.open("POST", file, !synchron);
		http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
		http.setRequestHeader("Content-length", this.data.length);
		http.setRequestHeader("Connection", "close")
	}
	if (after && !synchron) {
		http.onreadystatechange = function() {
			if (http.readyState == 4) {
				after(http.responseText);
			}
		};
	}
	if (this.type == "GET")
		http.send(null);
	else if (this.type == "POST")
		http.send(this.data);
	if (synchron) {
		if (after)
			return after(http.responseText);
		else 
			return http.responseText;
	}	
}
