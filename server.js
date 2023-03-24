const express = require ('express')
const cors = require('cors')
const axios = require('axios')
const app = express()
app.use(cors())
require('dotenv').config()


app.get('/favorite', getFavorite)
app.get('/trending', getTrending)
app.get('/search', searchHandler)
app.get('/movie', movieHandler)
app.get('/rate', rateHandler)


app.get('/', (req, res) => {                    
    const myData = require('./data.json')
    const resData = new MyData(myData)
    res.json(resData)
})

function getFavorite (req, res)  {
    res.send('Welcome to Favorite Page')
}

function getTrending(req, res, next)  {
    const url = `https://api.themoviedb.org/3/trending/all/week?api_key=bb696566aeb1c17e12b8f63e878cbfbf&language=en-US`
    const params = {
        page: req.query.page
    }
    axios.get(url, { params }).then(mohammad => {
        mohammad.data.results = mohammad.data.results.map(asa => new Movie(asa))
        res.json(mohammad.data)
    }).catch(err => {
        next(err)
    })
}


function searchHandler(req,res){
    const url = `https://api.themoviedb.org/3/search/movie?api_key=bb696566aeb1c17e12b8f63e878cbfbf&language=en-US&query=The&page=2`
    const params = {
        page: req.query.page
    }
    axios.get(url, { params }).then(mohammad => {
        mohammad.data.results = mohammad.data.results.map(asa => new Movie(asa))
        res.json(mohammad.data)
    }).catch(err => {
        next(err)
    })
}

function movieHandler(req,res,){
    const url=`https://api.themoviedb.org/3/movie/popular?api_key=bb696566aeb1c17e12b8f63e878cbfbf&language=en-US&page=1`
    const params={
        page: req.query.page
    }
    axios.get(url, {params}).then(resp => {
        res.json(resp.data)
    })
}

function rateHandler(req,res,){
    const url=`https://api.themoviedb.org/3/movie/top_rated?api_key=bb696566aeb1c17e12b8f63e878cbfbf&language=en-US&page=1`
    const params={
        page: req.query.page
    }
    axios.get(url, {params}).then(resp => {
        res.json(resp.data)
    })
}
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
    this.poster_path = poster_path;
    this.overview = overview;
}

function Movie({ id, title, release_date, poster_path, overview }) {
    this.id = id
    this.title = title;
    this.release_date = release_date;
    this.poster_path = poster_path;
    this.overview = overview;
}


const port = 3000
app.listen(port, () => console.log(' Server start , listining in port: ' + port))
