const HData = require('hdata').HData
var conn
const fs = require('fs');
var path = require('path')
const express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var fileStoreOptions = {};
const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

var configpath = "config.json"
var config = { "hdata": { "host": "127.0.0.1", "port": 8888 }, "app": { "port": 3000 } }

if (fs.existsSync(configpath)) {
	config = JSON.parse(fs.readFileSync(configpath));
}

const hdmaVersion = "0.0.1a"
var connectionInfo

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

function HDstatus() {
	conn.status( (res, err) => {
		if (!err) {
			var response = `\n\rHData Server has the status: ${res.status}, and has ${res.jobs} pending jobs. ${res.tables} tables exist in the database.`
			console.log(response)
		} else {
			console.log(err)
		}
	})
}

function connectTo(host, port) {
	if(host == '' || host == undefined) { host = "127.0.0.1" }
	if(port == '' || port == undefined) { port = "8888" }
	console.log(`Connecting to HData Server at ${host} on port ${port}...`)
	var options = {
		"host": host,
		"port": port
	}
	conn = new HData(options)
	connectionInfo = options
	HDstatus()
}

app.use(session({
	store: new FileStore(fileStoreOptions),
	name: 'hdatamyadmin',
	secret: '362150441',
	resave: false,
	saveUninitialized: false
}))

function clearSessionAuth(req) {
	req.session.login = {}
	req.session.login.auth = false
}

app.use(function (req, res, next) {
	if (!req.session.login) {
		clearSessionAuth(req)
		console.log("New session")
	}
	next()
})

app.get('/api/info', (req, res) => {
	var data = {
		"hdmaVersion" : hdmaVersion,
		"connectionInfo" : connectionInfo
	};
	res.json(data);
})

app.get('/api/hdata/status', (req, res) => {
	conn.status((data, err) => {
		if (!err) {
			res.json(data)
		} else {
			console.log(err)
			res.send(err)
		}
	})
})

app.post('/api/hdata/login', (req, res) => {
	var user = req.body.username
	var password = req.body.password
	conn.login(user, password, (data, err) => {
		if (!err) {
			if (data.status == "OK" || data.status == "LI") {
				req.session.login.auth = true
				req.session.login.username = user
				console.log(`Logged in as ${user}!`)
				if(req.session.login.auth) {
					res.redirect("/")
				}
			} else {
				clearSessionAuth(req)
				console.log("Invalid username or password")
				res.redirect("/login.html?error="+data.status)
			}
		} else {
			console.log(err)
			res.send(err)
		}
	})
})

app.get('/api/hdata/logout', (req, res) => {
	clearSessionAuth(req)
	conn.logout((data, err) => {
		if(!err) {
			if(data.status == "OK") {
				console.log("Successfully logged out")
			} else if(data.status == "NLI") {
				console.log("You need to be logged in to logout")
			} else {
				console.log(data)
			}
			res.redirect("/login.html")
		} else {
			console.log(err)
			res.send(err)
		}
	})
})

// needs to be logged in //

app.all('/api/hdata/*', (req, res, next) => {
	if(req.session.login.auth && req.session.login.auth !== '') {
		conn.getUser(req.session.login.username, (data, err) => {
			if(!err) {
				if(data.status == "NLI") {
					clearSessionAuth(req)
					console.log("Corrected auth sess: " + data.status)
				}
			} else {
				console.log(err)
				res.send(err)
			}
			if(req.session.login.auth) {
				next()
			} else {
				res.json(req.session.login)
			}
		})
	} else {
		res.json(req.session.login)
	}
})

app.get('/api/hdata/login', (req, res) => {
	res.json(req.session.login)
})

app.post('/api/hdata/createuser', (req, res) => {
	var username = req.body.username
	var password = req.body.password
	var retypePassword = req.body.retypePassword
	var permissions = req.body.permissions
	if(password !== retypePassword) {
		res.redirect("/newuser.html?error=PDOM")
	} else {
		conn.createUser(username, password, permissions, (data, err) => {
			if(!err) {
				if (data.status == "OK") {
					console.log("User created!")
					res.redirect("/users.html")
				} else {
					console.log("Insufficient permissions")
					res.redirect("/newuser.html?error="+data.status)
				}
			} else {
				console.log(err)
				res.send(err)
			}
		})
	}
})

app.get('/api/hdata/getuser', (req, res) => {
	var username = req.query.username
	conn.getUser(username, (data, err) => {
		if (!err) {
			res.json(data)
		} else {
			console.log(err)
			res.send(err)
		}
	})
})

app.post('/api/hdata/updatepassword', (req, res) => {
	var password = req.body.newPassword
	var retypePassword = req.body.retypePassword
	if(password !== retypePassword) {
		res.redirect("/changepassword.html?error=PDOM")
	} else {
		conn.updatePassword(req.session.login.username, password, (data, err) => {
			if(!err) {
				if (data.status == "OK") {
					console.log("Password updated!")
					res.redirect("/")
				} else {
					console.log("Insufficient permissions")
					res.redirect("/changepassword.html?error="+data.status)
				}
			} else {
				console.log(err)
				res.send(err)
			}
		})
	}
})

app.get('/api/hdata/gettables', (req, res) => {
	conn.getTables((data, err) => {
		if (!err) {
			res.send(data) //Should return an array ["table1","table2"]
		} else {
			console.log(err)
			res.send(err)
		}
	})
})

/* table actions */

app.get("/api/hdata/*", (req, res, next) => {
	var tableName = req.query.tableName
	if(tableName === undefined || tableName == "") {
		res.json({ "status": "TDNE" })
	} else {
		next()
	}
})

app.post("/api/hdata/*", (req, res, next) => {
	var tableName = req.body.tableName
	if(tableName === undefined || tableName == "") {
		res.json({ "status": "TDNE" })
	} else {
		next()
	}
})

app.post('/api/hdata/createtable', (req, res) => {
	var tableName = req.body.tableName
	conn.createTable(tableName, (data, err) => {
		if (!err) {
			if (data.status == "OK") {
				console.log("Table "+tableName+" created!");
				res.json(data);
			} else {
				console.log(data)
				res.send(data)
			}
		} else {
			console.log(err)
			res.send(err)
		}
	});
})

app.post('/api/hdata/deletetable', (req, res) => {
	var tableName = req.body.tableName
	conn.deleteTable(tableName, (data, err) => {
		if (!err) {
			console.log("Table "+tableName+" deleted!");
			res.json(data)
		} else {
			console.log(err)
			res.send(err)
		}
	})
})

app.post('/api/hdata/setkey', (req, res) => {
	var tableName = req.body.tableName
	var keyName = req.body.keyName
	var value = req.body.value
	conn.setKey(tableName, keyName, value, (data, err) => {
		if (!err) {
			if (data.status == "OK") {
				console.log("Key "+keyName+" for table "+tableName+" created!");
				res.json(data);
			} else {
				console.log(data)
				res.send(data)
			}
		} else {
			console.log(err)
		}
	})
})

app.post('/api/hdata/deletekey', (req, res) => {
	var tableName = req.body.tableName
	var keyName = req.body.keyName
	conn.deleteKey(tableName, keyName, (data,err) => {
		if (!err) {
			if (res.status == "OK") {
				console.log("Key "+keyName+" in "+tableName+" deleted!");
				res.json(data);
			} else {
				console.log(data);
				res.json(data);
			}
		} else {
			console.log(err);
			res.json(err);
		}
	})
})

app.get('/api/hdata/tablekeys', (req, res) => {
	var tableName = req.query.tableName
	conn.tableKeys(tableName, (data, err) => {
		if (!err) {
			res.json(data.keys)
		} else {
			console.log(err)
			res.send(err)
		}
	})
})

app.use('/', express.static(path.join(__dirname, 'src/static/')))

app.listen(config.app.port, () => {
	console.log('HDataMyAdmin listening at http://localhost:%s', config.app.port);
	connectTo(config.hdata.host, config.hdata.port)
})