'use strict'
const express = require ('express')
const bodyParser=require('body-parser')
const recipeData = require('./movie Data/data.json')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const app = express()
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
app.use(cors())
const {Client}=require('pg')
let url=`postgres://mohammad:0000@localhost:5432/movies`
// const client = new Client(url)
// const dbClient = new pg.Client(process.env.DB_URL)



// app.get('/', (req, res) => {                    
   
app.get('/', getHome)
app.get('/favorite', getFavorite)
app.get('/trending', getTrending)
app.get('/search', searchHandler)
app.get('/movie', movieHandler)
app.get('/rate', rateHandler)
app.get('/getMovies', get_movie)
app.post('/addMovie',addMovieHandler)


// app.get('/', (req, res) => {                    
//     const myData = require('./data.json')
//     const resData = new MyData(myData)
//     res.json(resData)
// })

function getHome(req, res) {

    let newdata = new Train(recipeData.title, recipeData.poster_path, recipeData.overview)
    res.send(newdata)
}

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

// let id,name,comment=req.body;  //destructuring
// //client.query(sql,value)
// let sql =`INSERT INTO movies (id,name,comment)
// VALUES($1,$2,$3);`
// let values=[id,name,comment]
// client.query(sql,values).then(
//     res.status(201).send("data successhully saved in db to server"
//     ).catch()

// )



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



function get_movie(req, res) {
    try {
        const movies =  getMovies()
        res.json(movies)
    } catch (error) {
        next(error)
    }
}

function addMovieHandler(req, res) {
    const body = req.body;
    try {
        const movie = new Movie(body)
        const resp = addMovie(movie, body.comment)
        res.json(resp)
    } catch (error) {
        next(error)
    }
}






 function getMovies() {
    const sql = `SELECT * FROM movies`
    const resp =  dbClient.query(sql)
    return resp.rows
}

 function addMovie(movie, comment) {
    const sql = `INSERT INTO movies (title, release_date, poster_path, overview, comment)
            VALUES ($1, $2, $3, $4, $5) RETURNING *;`
    const resp =  dbClient.query(sql, [movie.title, movie.release_date, movie.poster_path, movie.overview, comment])
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


// client.connect().then(()=>{
//     app.listen(port, () => console.log(' Server start , listining in port: ' + port))
// }).catch()

function Train(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

const port = 3050
app.listen(port, () => console.log(' Server start , listining in port: ' + port))

