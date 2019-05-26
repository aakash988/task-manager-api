const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const { userOneId, userOne, setupDatabase } = require('./fixtures/db')



beforeEach(setupDatabase)

test('Should signup a new user', async () => {
    const response = await request (app).post('/users').send({
        name: 'Robot',
        email: 'robot@example.com',
        password: 'Mypass777'
    }).expect(201)

    //Assert that the database was changed correctly
    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    //Assertions about the response
    //expect(response.body.user.name).toBe('Robot')
    expect(response.body).toMatchObject({
        user: {
            name: 'Robot',
            email: 'robot@example.com',
        },
        token: user.tokens[0].token
    })

    expect(user.password).not.toBe('Mypass777')
})

//Goal: Validate new token is saved
//1. Fetch the user from the database
//2. Assert that oken in response matches users second token
//3. Test your work!
test('Should login existing user', async () => {
    const response = await request (app).post('/users/login').send({
        email: userOne.email,
        password: userOne.password
    }).expect(200)
    const user = await User.findById(userOneId)
    const token = user.tokens[1].token
    expect(response.body.token).toBe(token)
})

test('Should not login nonexistant user', async () => {
    await request(app).post('/users/login').send({
        email: 'thompson123@example.com',
        password: '125store'
    }).expect(400)
})

test('Should get profile for user', async () => {
    await request (app)
        .get('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

test('Should not get profile for unauthenticated user', async () => {
    await request (app)
        .get('/users/me')
        .send()
        .expect(401)
})

test('Should delete account for user', async () => {
    const response = await request (app)
        .delete('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user).toBeNull()
})

test ('Should not delete account for unauthenticated user', async () => {
    await request (app)
        .delete('/users/me')
        .send()
        .expect(401)
})

test ('Should upload avatar image', async () => {
    await request(app)
        .post('/users/me/avatar')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .attach('avatar','tests/fixtures/profile-pic.jpg')
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.avatar).toEqual(expect.any(Buffer))
})

test('Should update valid user fields', async () => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            name: 'testing100'
        })
        .expect(200)

        const user = await User.findById(userOneId)
        expect(user.name).toEqual('testing100')
})

test ('Should not update invalid user fields', async() => {
    await request(app)
        .patch('/users/me')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            location: 'Hello'
        })
        .expect(400)
})



//Goal: Test user updates

//1. Create "Should update valid user fields"
//  - Update the name of the test user
//  - Check the data to confirm it's changed
//2. Create "Should not update invalid user fields"
//  - Update a location field and expect error status code
//3. Test your work!


//Goal: Test delete account
//1. Create "Should delete account for user"
//  - Setup auth header and expect correct status code
//2. Create "Should not delete account for unauthenticated user"
//  - Expect correct status code
//3. Test your work!

//Goal: Test login failure
//1. Create "Should not login nonexistant user"
//2. Send off the request with bad credentials
//3. Expect the correct status response
//4. Test your work

//Goal: Validate user is removed
//1. Fetch the user from the database
//2. Assert null response (user assertion from signup test)
//3. Test your work!