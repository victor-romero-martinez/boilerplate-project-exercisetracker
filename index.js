const express = require('express')
const app = express()
const cors = require('cors')
const connectDB = require('./db/connect.js')
const { postUser, getUsers, getUser } = require('./controllers/user.controller.js')
require('dotenv').config()

connectDB(process.env.MONGO_URI)

app.use(cors())
app.use(express.static('public'))
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/views/index.html')
});


app.get('/api/users/:_id', getUser)

app.get('/api/users', getUsers)


app.post('/api/users', postUser)

const listener = app.listen(process.env.PORT || 3000, () => {
  console.log('Your app is listening on port ' + listener.address().port)
})
