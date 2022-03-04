export{}
import express from 'express'
import  User from '../models/user'
import auth from '../middleware/auth'
const router = new express.Router()
require('../app')

router.post('/users', async (req:any, res:any) => {
    const user = new User(req.body)
    try {
        await user.save()           
        const token = await user.generateAuthToken()
        res.cookie('token',token,{
            expire: new Date(Date.now()+5000),
            httpOnly: true
        })
        res.status(201).send({ user, token })
    } catch (e) {
        console.log(e)
        res.status(400).send()
    }
})


router.post('/users/login', async (req:any, res:any) => {
    try {
        const user = await User.findByCredentials(req.body.email, req.body.password)
        const token = await user.generateAuthToken()  
        res.cookie('token',token,{
            expire: new Date(Date.now()+5000),
            httpOnly: true
        })
       
        res.send({ user, token })
    } catch (e) {
        res.status(400).send()
    }
})

router.post('/users/logout', auth, async (req:any, res:any) => {
    try {
        req.user.tokens = req.user.tokens.filter((token:any) => {
            return token.token !== req.token
        })
        await req.user.save()
        res.cookie('token',req.user.token,{
            expire: new Date(Date.now()+5000),
            httpOnly: true
        })

        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.post('/users/logoutAll', auth, async (req:any, res:any) => {
    try {
        req.user.tokens = []
        await req.user.save()
        res.send()
    } catch (e) {
        res.status(500).send()
    }
})

router.get('/users/me', auth, async (req:any, res:any) => {
    res.cookie('token',req.user.token,{
        expires: new Date(Date.now()+5000),
        httpOnly:true
    })
    res.send(req.user)

})

router.patch('/users/me', auth, async (req:any, res:any) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['name', 'email', 'password', 'age']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        updates.forEach((update) => req.user[update] = req.body[update])
        const update = await req.user.save()
        res.cookie('user',update,{ expires: new Date(Date.now()+5000),
        httpOnly : true
        })
        res.send(req.user)
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/users/me', auth, async (req:any, res:any) => {
    try {
        await req.user.remove()
        res.send(req.user)
    } catch (e) {
        res.status(500).send()
    }
})

export default router