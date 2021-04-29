const HData = require('hdata').HData
var conn
var path = require('path')
const express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')
var FileStore = require('session-file-store')(session)
var fileStoreOptions = {};

const app = express()
const port = process.env.PORT || 3000

app.use(express.json())
app.use(express.urlencoded({ extended: true }))

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
	if(host == '' || host == undefined) { host = '127.0.0.1' }
	if(port == '' || port == undefined) { port = '8888' }
	console.log(`Connecting to HData Server at ${host} on port ${port}...`)
	var options = {
		"host": host,
		"port": port
	}
	conn = new HData(options)
	HDstatus()
}

app.use(session({
	store: new FileStore(fileStoreOptions),
	name: 'hdatamyadmin',
	secret: '362150441',
	resave: false,
	saveUninitialized: true
}))

app.use(function (req, res, next) {
	if (!req.session.login) {
		req.session.login = {}
	}
	next()
})

app.get('/api/hdata/status', (req, res) => {
  var response = "Not available"
  conn.status((data, err) => {
	if (!err) {
      response = `HData Server has the status: ${data.status}, and has ${data.jobs} pending jobs. ${data.tables} tables exist in the database.\n\r`
		} else {
			console.log(err)
      data = err;
		}
    res.json(data)
	})
})

app.get('/api/hdata/login', (req, res) => {
	res.json(req.session.login)
})

app.post('/api/hdata/login', (req, res) => {
	var user = req.body.username
	var password = req.body.password
	conn.login(user, password, (data, err) => {
		if (!err) {
			if (data.status == "OK" || req.session.login.auth == true) {
				req.session.login.auth = true
				req.session.login.username = user
				console.log(`Logged in as ${user}!`)
				if(req.session.login.auth) { res.redirect('/') }
			} else {
				console.log("Invalid username or password")
				res.redirect('/login.html?error='+data.status)
			}
		} else {
			console.log(err)
			res.json(err)
		}
	});
})

app.get('/api/hdata/logout', (req, res) => {
	conn.logout((data, err) => {
		if(!err) {
			if(data.status == 'OK') {
				console.log("Successfully logged out")
			} else if(data.status == 'NLI') {
				console.log("You need to be logged in to logout")
			} else {
				console.log(data)
			}
			req.session.destroy( (err) => {
				console.log(err)
			})
			res.redirect('/login.html')
		} else {
			console.log(err)
			res.json(err)
		}
	});
})

app.use('/', express.static(path.join(__dirname, 'src/static/')))

app.listen(port, () => {
	console.log('HDataMyAdmin listening at http://localhost:%s', port);
	connectTo()
})