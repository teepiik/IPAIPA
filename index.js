const express = require('express')
const app = express()
const cors = require('cors')
const bodyParser = require('body-parser')

app.use(cors())
app.use(bodyParser.json())

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

app.get('/beers', (req, res) => {
    res.json(beers)
})

app.get('/beers/:id', (request, response) => {
    const id = Number(request.params.id)
    const beer = beers.find(beer => beer.id === id)
    if (beer) {
        response.json(beer)
    } else {
        response.status(404).end()
    }

})

const PORT = process.env.PORT || 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})