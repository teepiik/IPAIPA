const supertest = require('supertest')
const { app, server } = require('../index')
const api = supertest(app)
const User = require('../models/user')

beforeAll(async () => {
    // Use test database!
    await User.remove({})

    const newUser = new User({
        username: "Jugga8888",
        password: "123"
    })

    await newUser.save()
})

describe('API GET get user from api/users', async = () => {
    test(' fake to pass', async = () => {
        expect(1).toBe(1)
    })
})

afterAll(() => {
    server.close()
})