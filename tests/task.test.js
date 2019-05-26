const request = require('supertest')
const app = require('../src/app')
const Task = require('../src/models/tasks')
const { userOneId, 
        userOne, 
        userTwoId, 
        userTwo, 
        setupDatabase, 
        taskOne, 
        taskTwo, 
        taskThree 
        } = require('./fixtures/db')



beforeEach(setupDatabase)

test('Should create task for user', async () => {
    const response = await request (app)
        .post('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send({
            description: 'from test'
        })
        .expect(201)
    const task = await Task.findById(response.body._id)
    expect(task).not.toBeNull()
    expect(task.completed).toEqual(false)
})

//Goal: GET /tasks

//1. Request all tasks for user one
//2. Assert the correct status code
//3. Check the length of the response array is 2
//4. Test your work!

test('Should send back all tasks for first user', async () => {
    const response = await request (app)
        .get('/tasks')
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)

        expect(response.body.length).toEqual(2)
})

test('Should not delete tasks from another user', async () => {
    const response = await request (app)
        .delete(`/tasks/${taskOne._id}`)
        .set('Authorization', `Bearer ${userTwo.tokens[0].token}`)
        .send()
        .expect(404)

    const task = await Task.findById(taskOne._id)
    expect(task).not.toBeNull()
})

test('Should fetch user task by id', async () => {
    const response = await request (app)
        .get('/tasks/' + taskOne._id)
        .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
        .send()
        .expect(200)
})

