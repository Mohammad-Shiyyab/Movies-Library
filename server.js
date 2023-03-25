const express = require ('express')
const cors = require('cors')
const axios = require('axios')
const dbClient = new pg.Client(process.env.DB_URL)
const app = express()
app.use(cors())
require('dotenv').config()


app.get('/favorite', getFavorite)
app.get('/trending', getTrending)
app.get('/search', searchHandler)
app.get('/movie', movieHandler)
app.get('/rate', rateHandler)
app.get('/getMovies', get_movie)
app.post('/addMovie',addMovieHandler)


app.get('/', (req, res) => {                    
    const myData = require('./data.json')
    const resData = new MyData(myData)
    res.json(resData)
})

function getFavorite (req, res)  {
    res.send('Welcome to Favorite Page')
}
function addMovieHandler(req, res){

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



async function get_movie(req, res) {
    try {
        const movies = await getMovies()
        res.json(movies)
    } catch (error) {
        next(error)
    }
}

async function addMovieHandler(req, res) {
    const body = req.body;
    try {
        const movie = new Movie(body)
        const resp = await addMovie(movie, body.comment)
        res.json(resp)
    } catch (error) {
        next(error)
    }
}






async function getMovies() {
    const sql = `SELECT * FROM movies`
    const resp = await dbClient.query(sql)
    return resp.rows
}

async function addMovie(movie, comment) {
    const sql = `INSERT INTO movies (title, release_date, poster_path, overview, comment)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`
    const resp = await dbClient.query(sql, [movie.title, movie.release_date, movie.poster_path, movie.overview, comment])
    return resp.rows


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
