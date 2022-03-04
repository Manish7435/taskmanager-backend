const app = require('./app')
const cors = require('cors')
app.use(cors())
app.get('/users', function (req:any, res:any, next:any) {
    res.json({msg: 'This is CORS-enabled for all origins!'})
    next()
  })

const port = process.env.PORT



app.listen(port, () => {
    console.log('Server is up on port ' + port)
})
