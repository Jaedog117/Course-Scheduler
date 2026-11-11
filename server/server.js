// server/server.js
require('dotenv').config()
const express = require('express')
const cors = require('cors')

const coursesRouter = require('./routes/courses')
const completionsRouter = require('./routes/completions')

const app = express()
const PORT = process.env.PORT || 3000

app.use(cors({ origin: process.env.CLIENT_ORIGIN }))
app.use(express.json())

app.use('/api', coursesRouter)
app.use('/api', completionsRouter)

app.listen(PORT, () => {
    console.log(`API running at http://localhost:${PORT}`)
})
