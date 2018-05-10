const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const Beer = require('../models/beer')
const { initialBeers, beersInDatabase } = require('./test_helper')

beforeAll(async () => {
    // Use test database!
    await Beer.remove({})

    const beerObjects = initialBeers.map(beer => new Beer({
        name: beer.name,
        type: beer.type,
        brewery: beer.country,
        country: beer.country,
        alcohol_percent: beer.alcohol_percent
    }))

    const promiseArray = beerObjects.map(beer => beer.save())
    await Promise.all(promiseArray)
})

describe('API GET all from api/beers', async () => {

    test('beers are returned as json', async () => {
        await api
            .get('/api/beers')
            .expect(200)
            .expect('Content-Type', /application\/json/)
    })

    test('all beers are returned and they contain one specific beer', async () => {
        const beersInTestDB = await beersInDatabase()

        const response = await api
            .get('/api/beers')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(beersInTestDB.length)

        const beerNames = response.body.map(beer => beer.name)
        expect(beerNames).toContain('Koff')

    })
})


afterAll(() => {
    server.close()
})