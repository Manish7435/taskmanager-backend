const express = require('express')
const Task = require('../models/task')
const redis = require('redis');
const auth = require('../middleware/auth')
const router = new express.Router()

const REDIS_PORT = process.env.REDIS_PORT || 6379
const client = redis.createClient();

   
(async () => {
    await client.connect()
})();

router.post('/tasks', auth, async (req, res) => {
    const task = new Task({
        ...req.body,
        owner: req.user._id
    })
    try {
        // await task.save()
        const savedtask = await task.save()
        res.json(savedtask);
        const tasks = await Task.find({owner:req.user._id});
        client.setEx(req.user._id,3600*24,JSON.stringify(tasks));
        
    } catch (e) {
        console.log(e)
        res.status(400).send(e)
    }
})



// router.get('/tasks/:id', auth, async (req, res) => {
//     const _id = req.params.id
//     try {
        
//         const task = await Task.findOne({ _id, owner: req.user._id })
//         if (!task) {
//             return res.status(404).send()
//         }
//         res.send(task)
//     } catch (e) {
//         res.status(500).send()
//     }
// })

router.get('/tasks', auth, async (req, res) => {
    try {
        client.get(req.user._id, (err, data) => {
            if (err) throw err;
        
            if (data !== null) {
              res.json(JSON.parse(tasks));
              return
            } else {
              next();
            }
          });
        const tasks = await Task.find({owner:req.user._id})
        if (!tasks) {
            return res.status(404).send()
        }
        res.send(tasks)
    } catch (e) {
        console.log(e)
        res.status(500).send()
    }
})


router.patch('/tasks/:id', auth, async (req, res) => {
    const updates = Object.keys(req.body)
    const allowedUpdates = ['description', 'isCompleted']
    const isValidOperation = updates.every((update) => allowedUpdates.includes(update))

    if (!isValidOperation) {
        return res.status(400).send({ error: 'Invalid updates!' })
    }

    try {
        
        const task = await Task.findOne({ _id: req.params.id, owner: req.user._id})

        if (!task) {
            return res.status(404).send()
        }

        updates.forEach((update) => task[update] = req.body[update])
        const savedtask= await task.save()
        res.json(savedtask);
        const tasks = await Task.find({owner:req.user._id})
        client.setEx(req.user._id,3600*24,JSON.stringify(tasks))
    } catch (e) {
        res.status(400).send(e)
    }
})

router.delete('/tasks/:id', auth, async (req, res) => {
    try {
        const task = await Task.findOneAndDelete({ _id: req.params.id, owner: req.user._id })
        if (!task) {
            res.status(404).send()
        }

        res.send(task)
        client.del(task)
    } catch (e) {
        res.status(500).send()
    }
})

module.exports = router