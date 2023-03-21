const express = require ('express')
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

app.get('/trending ',(req, res, next) => {
    const key = process.env.API_KEY
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=${key}&language=en-US`
    const params = {
        page: req.query.page
    }
})

app.get('/search' ,(req, res, next) =>{
    const key = process.env.API_KEY
    const url = `https://api.themoviedb.org/3/search/movie?api_key=${key}&language=en-US`
    const params = {
        query: req.query.query,
        page: req.query.page
    }
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

function MyData({id,title,release_date, poster_path, overview }) {
    this.id=id;
    this.release_date=release-date;
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}


const port = 3000
app.listen(port, () => console.log(' Server start , listining in port: ' + port))
