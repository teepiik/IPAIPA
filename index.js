const http = require('http')
const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const cors = require('cors')
const mongoose = require('mongoose')
const beerRouter = require('./controllers/beerController')
const usersRouter = require('./controllers/userController')
const loginRouter = require('./controllers/login')
const config = require('./utils/config')

require('dotenv').config()

mongoose
    .connect(config.mongoUrl)
    .then(() => {
        console.log('connected to database', config.mongoUrl)
    })
    .catch(error => {
        console.log(error)
    })

mongoose.Promise = global.Promise
const server = http.createServer(app)

server.listen(config.port, () => {
    console.log(`Server running on port ${config.port}`)
})

server.on('close', () => {
    mongoose.connection.close()
})

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))
app.use('/api/beers', beerRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)

// for dev uses only, temporary
const testUser = {
    username: 'test',
    password: 'test1'
}

const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

module.exports = {
    app, server
}