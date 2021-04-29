function getAllUrlParams() {
	var queries = location.search.slice(1).split("&");
	var obj = {};
	for (var i in queries) {
		if (queries[i] != "") {
			var tmp = queries[i].split("=");
			obj[decodeURIComponent(tmp[0])] = decodeURIComponent(tmp[1]);
		}
	}
	return obj;
}

function $(id) {
	if (id.startsWith(".")) {
		return document.getElementsByClassName(id.substring(1));
	} else {
		return document.getElementById(id);
	}
}

var menuState = 1;

function menuBtnClicked() {
	if (menuState == 1) {
		menuState = 0;
		$("sidebar").style.display = "none";
		document.body.classList.remove("with-sidebar");
		$("menuBtn").innerHTML = "arrow_right";
		$("menuBtn").title = "Show panel";
	} else {
		menuState = 1;
		$("sidebar").style.display = "block";
		document.body.classList.add("with-sidebar");
		$("menuBtn").innerHTML = "arrow_left";
		$("menuBtn").title = "Hide panel";
	}
}
