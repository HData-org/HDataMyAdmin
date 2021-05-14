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

function errorCodeToMsg(code) {
	switch(code) {
		case 'OK':
			return 'All good, no errors'
		case 'NLI':
			return 'Not logged in'
		case 'LI':
			return 'Logged in'
		case 'AERR':
			return 'Auth error (incorrect username/password)'
		case 'PERR':
			return 'Insufficient permissions'
		case 'UE':
			return 'User already exists'
		case 'UDNE':
			return 'User doesn\'t exist'
		case 'TE':
			return 'Table already exists'
		case 'TDNE':
			return 'Table doesn\'t exist'
		case 'KDNE':
			return 'Key doesn\'t exist'
		case 'EVERR':
			return 'Evaluation error (error with evaluator when querying)'
		default:
			return 'Uknown error ('+code+')'
	}
}

if(localStorage.getItem == undefined || localStorage.getItem == '') {
	localStorage.setItem("menuState", 1);
}
var menuState = localStorage.getItem("menuState");

function menuUpdate() {
	if(menuState == 1) {
		$("sidebar").style.display = "none";
		document.body.classList.remove("with-sidebar");
		$("menuBtn").innerHTML = "arrow_right";
		$("menuBtn").title = "Show panel";
	} else {
		$("sidebar").style.display = "block";
		document.body.classList.add("with-sidebar");
		$("menuBtn").innerHTML = "arrow_left";
		$("menuBtn").title = "Hide panel";
	}
}
function menuBtnClicked() {
	if (menuState == 1) {
		menuState = 0;
	} else {
		menuState = 1;
	}
	menuUpdate();
	localStorage.setItem("menuState", menuState);
}

if(typeof page == 'undefined' || page !== 'login') {
	menuUpdate();
}