const express = require('express')
const connectToMongo = require("./db")
const cors = require('cors')
const app = express()

app.use(cors())
app.use(express.json())
const port = 3001
connectToMongo()

app.use('/api/auth', require('./routes/auth'))
app.use('/api/notes', require('./routes/notes'))

app.listen(port)