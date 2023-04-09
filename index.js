'use strict'
const express = require ('express')
const cors = require('cors')
const axios = require('axios')
require('dotenv').config()
const bodyParser=require('body-parser')
const recipeData = require('./movie Data/data.json')
const  {Client}  = require('pg')
let url=`postgres://mohammad:0000@localhost:5432/movies`
const client = new Client(url)
const app = express()
app.use(cors())
const port = process.env.PORT ;
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json());
let apiKey=process.env.API_KEY;                
   
app.get('/', getHome)
app.get('/favorite', getFavorite)
app.get('/trending', getTrending)
app.get('/search', searchHandler)
app.get('/movie', movieHandler)
app.get('/rate', rateHandler)
app.get('/getMovies', getMoviesHandler)
app.post('/addMovie',addMovieHandler)
app.get('/movies/:id',getMovieHandler )
app.put('/movies/:id',updateMovieHandler)
app.delete('/movies/:id',deleteMovieHandler)



function getHome(req, res) {

    let newdata = new Train(recipeData.title, recipeData.poster_path, recipeData.overview)
    res.send(newdata)
}


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

function searchHandler (req,res){
    let movieName = req.query.title;
    let url = `https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=en-US&query=${movieName}&The&page=2`;

    axios.get(url)
    .then((result)=>{

        let dataSearch = result.data.results.map((search)=>{
            return new Requets(search.id, search.title,search.release_date,search.poster_path,search.overview)
        })
        res.json(dataSearch);
    })
    .catch((err)=>{
        console.log(err);
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

function  getMoviesHandler (req,res){
    let sql=`SELECT * FROM movies;`
    client.query(sql).then((result)=>{
        res.json(result.rows)
    }

    ).catch()
}

function addMovieHandler(req,res){
    let {title,comment} = req.body ;
    let sql = `INSERT INTO movies (title,comment)
    VALUES ($1,$2) RETURNING *`;
    let values = [title,comment];
    client.query(sql,values).then((result)=>{
        res.status(201).json(result.rows)

    }
    ).catch() 
}




function updateMovieHandler(req,res){
    // console.log(11111111,req.params);
    let movieID = req.params.id // params
    let {comment} = req.body;
    let sql=`UPDATE movies SET  comment = $1
    WHERE id = $2 RETURNING *`;
    let values = [comment,movieID]; 
    client.query(sql,values).then(result=>{
        console.log(result.rows);
        res.send(result.rows)
    }).catch()

}
function deleteMovieHandler(req,res){
    let movieID = req.params.id; 
    let sql=`DELETE FROM movies WHERE id = $1`; 
    let value = [movieID];
    client.query(sql,value).then(result=>{
        res.status(204).send("deleted");
    }).catch()


}
function  getMovieHandler (req,res){
    let movieID = req.params.id 
    let sql=`SELECT *
    FROM movies
    WHERE id = $1`;
    let values = [movieID];
    client.query(sql,values).then((result)=>{
        res.json(result.rows)
    }

    ).catch()
}







function Requets(id,title,release_date,poster_path,overview){
    this.id=id;
    this.title=title;
    this.release_date=release_date;
    this.poster_path=poster_path;
    this.overview=overview;
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




function Train(title, poster_path, overview) {
    this.title = title;
    this.poster_path = poster_path;
    this.overview = overview;
}

client.connect().then(()=>{
app.listen(3080, 'localhost', function(err) {
    if (err) return console.log(err);
    else{
    console.log("Listening at http://localhost:%s", 3080);}
});
}).catch()

