const express = require('express')
const cors = require('cors')
const app = express()
app.use(cors())

app.get('/', (req, res) => {
    const myData = require('./data.json')
    const resData = new MyData(myData)
    res.json(resData)
})

app.get('/favorite', (req, res) => {
    res.send('Welcome to Favorite Page')
})

app.use((req, res, next) => {
    res.status(404)
    res.json({
        "status": 404,
        "responseText": "Page not found"
    })
})

app.use((err, req, res, next) => {
    console.error(err)
    res.status(500)
    res.json({
        "status": 500,
        "responseText": "Sorry, internal server error"
    })
})

function MyData({ title, poster_path, overview }) {
    this.title = title;
    this.overview = overview;
    this.poster_path = poster_path;
}
const port = 5000
app.listen(port, () => console.log('listining in port: ' + port))

