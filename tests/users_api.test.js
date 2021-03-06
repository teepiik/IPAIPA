const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')
const { usersInDatabase } = require('./test_helper')

beforeAll(async () => {
    // Use test database!
    await User.remove({})

    const newUser = new User({
        username: "Jugga8888",
        passwordHash: "123"
    })

    const newUser2 = new User({
        username: "Testimies",
        passwordHash: "321"
    })

    // Since this saves straight to db, passwords are not hashed in db
    await newUser.save()
    await newUser2.save()
})

describe('API GET get user from', async () => {
    test(' api/users: users are returned and formatted correctly', async () => {
        usersInDB = await usersInDatabase()

        const response = await api
            .get('/api/users')
            .expect(200)
            .expect('Content-Type', /application\/json/)

        expect(response.body.length).toBe(usersInDB.length)

        // no password in response
        response.body.forEach(user => {
            expect(user.passwordHash).toBe(undefined)
        });
    })
})

afterAll(() => {
    server.close()
})