const request = require('supertest')
const app = require('../src/app')
const User = require('../src/models/user')
const {userOne, userOneId, setupDatabase} = require('./fixtures/db')



beforeEach(setupDatabase)

test('Should sign up a new user',async()=>{
    const response = await request(app).post('/users').send({
        name : 'Manish',
        password : 'red1234@',
        email : 'myname@gmail.com'
    }).expect(201)

    const user = await User.findById(response.body.user._id)
    expect(user).not.toBeNull()

    expect(response.body).toMatchObject({
        user:{
            name: 'Manish',
        email: 'myname@gmail.com'
    }, 
    token : user.tokens[0].token })
    expect(user.password).not.toBe('red1234@')
})

test('Should login existing user', async ()=>{
    const reesponse = await request(app).post('/users/login').send({
        email : userOne.email,
        password : userOne.password
    }).expect(200)
   
})

test('Should not login nonexisting user',async ()=>{
    await request(app).post('/users/login').send({
        email: userOne.email,
        password : 'usvwvvfd'
    }).expect(400)
    
})

test('Should get profile for user', async ()=>{
    await request(app)
    .get('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)
})

test('Should not get profile for unauthenticted user', async ()=>{
    await request(app)
    .get('/users/me')
    .send()
    .expect(401)
})

test('Should delete account for user', async ()=>{
    await request(app)
    .delete('/users/me')
    .set('Authorization', `Bearer ${userOne.tokens[0].token}`)
    .send()
    .expect(200)

    const user = await User.findById(userOneId)
    expect(user).toBeNull()
})

test('Should not delete unauthenticated user', async ()=>{
    await request(app)
    .delete('/users/me')
    .send()
    .expect(401)
})

test('Should update valid user fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        name: 'mack'
    }).expect(200)

    const user = await User.findById(userOneId)
    expect(user.name).toEqual('mack')
})

test('Should not update invalid user fields', async()=>{
    await request(app)
    .patch('/users/me')
    .set('Authorization',`Bearer ${userOne.tokens[0].token}`)
    .send({
        location: 'India'
    }).expect(400)

   
})