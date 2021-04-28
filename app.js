const HData = require('hdata').HData
var conn
var path = require('path')
const express = require('express')
var parseurl = require('parseurl')
var session = require('express-session')

const app = express()
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

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
	HDstatus();
}

app.get('/api/hdata/status', (req, res) => {
  var response = "Not available"
  conn.status((data, err) => {
	if (!err) {
      response = `\n\rHData Server has the status: ${data.status}, and has ${data.jobs} pending jobs. ${data.tables} tables exist in the database.`
		} else {
			console.log(err)
      data = err;
		}
    res.json(data)
	})
})

app.post('/api/hdata/login', (req, res) => {
	var user = req.body.username
	var password = req.body.password
	conn.login(user, password, function(data, err) {
		if (!err) {
			if (data.status == "OK") {
				console.log(`Logged in as ${user}!`)
				res.json('OK')
			} else {
				console.log("\n\rInvalid username or password")
				res.json('BAD')
			}
		} else {
			console.log(err)
			res.json(err)
		}
	});
})

app.use('/', express.static(path.join(__dirname, 'src/static/')))

app.listen(port, () => {
  console.log(`HDataMyAdmin listening at http://localhost:${port}`)
  connectTo()
})