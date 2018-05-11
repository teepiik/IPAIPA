require('dotenv').config()

let port = process.env.PORT
let mongoUrl = process.env.MONGODB_URI
let activationCode = process.env.ACTIVATIONCODE

if (process.env.NODE_ENV === 'test') {
    port = process.env.TEST_PORT
    mongoUrl = process.env.MONGOTESTDB_URI
    activationCode = process.env.ACTIVATIONCODETEST
}

module.exports = {
    mongoUrl,
    port,
    activationCode
}