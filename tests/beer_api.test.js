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

describe('API GET single beer from api/beers/:id, ', async () => {

    test('beer is right', async () => {
        const beer = await Beer.findOne()

        const response = await api
            .get(`/api/beers/${beer.id}`)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.name).toBe(beer.name)
    })
})

describe('API POST a new beer to api/beers, ', async () => {  

    test('a new beer is created', async () => {

        const beersBefore = await beersInDatabase()

        const newBeer = {
            name: 'Iisalmi Pale Ale',
            type: 'IPA',
            brewery: 'Olvi',
            country: 'Finland',
            alcohol_percent: '4,7'
        }

        const addedBeer = await api
            .post('/api/beers')
            .send(newBeer)
            .expect(201)
            .expect('Content-Type', /application\/json/)

        const beersAfter = await beersInDatabase()
        expect(beersBefore.length).toBe(beersAfter.length - 1)

        const beerNames = beersAfter.map(beer => beer.name)
        expect(beerNames).toContain('Iisalmi Pale Ale')
    })
})

describe('API UPDATE call to api/beers/:id, ', async () => {  

    test('to update the beer', async () => {

        const beersBefore = await beersInDatabase()

        const beerToUpdate = beersBefore[beersBefore.length - 1]

        const changedBeer = {
            name: 'Edited',
            type: 'IPA',
            brewery: 'Olvi',
            country: 'Finland',
            alcohol_percent: '4,7'
        }

        const response = await api
            .put(`/api/beers/${beerToUpdate.id}`)
            .send(changedBeer)
            .expect(200)
            .expect('Content-Type', /application\/json/)

        const beersAfter = await beersInDatabase()

        const beerNames = beersAfter.map(beer => beer.name)
        expect(beerNames).not.toContain(beerToUpdate.name)
        expect(beerNames).toContain(changedBeer.name)
        expect(response.body.name).toBe('Edited')
    })
})

describe('API DELETE call to api/beers, ', async () => {  

    test('removes correct beer', async () => {

        const beersBefore = await beersInDatabase()

        const beerToDelete = beersBefore[beersBefore.length - 1]

        await api
            .delete(`/api/beers/${beerToDelete.id}`)
            .expect(204)

        const beersAfter = await beersInDatabase()
        expect(beersBefore.length).toBe(beersAfter.length + 1)

        const beerNames = beersAfter.map(beer => beer.name)
        expect(beerNames).not.toContain('Iisalmi Pale Ale')
    })
})


afterAll(() => {
    server.close()
})