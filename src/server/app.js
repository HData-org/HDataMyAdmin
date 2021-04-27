const express = require('express')
const app = express()
var path = require('path')
const port = 3000

app.use('/', express.static(path.join(__dirname, '/../static')))

app.listen(port, () => {
  console.log(`HDataMyAdmin listening at http://localhost:${port}`)
})