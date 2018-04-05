const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())
app.use(express.static('build'))

let beers = [
    {
        id: 1,
        name: 'Koff',
        type: 'Lager'

    },
    {
        id: 2,
        name: 'Paulaner',
        type: 'Wheat beer'

    }
]

app.get('/', (req, res) => {
    res.send('<h1>Welcome to IPAIPA</h1><p>Hi Denise!</p>')
})

app.get('/api/beers', (req, res) => {
    res.json(beers)
})

app.get('/api/beers/:id', (request, response) => {
    const id = Number(request.params.id)
    const beer = beers.find(beer => beer.id === id)
    if (beer) {
        response.json(beer)
    } else {
        response.status(404).end()
    }

})

// middleware for errors
const error = (request, response) => {
    response.status(404).send({ error: 'unknown endpoint' })
}

app.use(error)

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})