const express = require ('express')
const cors = require('cors')
const axios = require('axios')
const pg = require('pg')
const dbClient = new pg.Client(process.env.DB_URL)
const app = express()
app.use(cors())
require('dotenv').config()


app.get('/favorite', getFavorite)
app.get('/trending', getTrending)
app.get('/search', searchHandler)
app.get('/movies', movieHandler)
app.get('/rate', rateHandler)
app.get('/getMovies', get_movie)
app.post('/addMovie',addMovieHandler)
app.get('/movies/:id',getMovieHandler )
app.put('/movies/:id',updateMovieHandler)
app.delete('/movies/:id',deleteMovieHandler)


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

async function deleteMovieHandler(req, res, next) {
    const id = req.params.id
    try {
        await deleteMovie(id)
        res.status(204).json({})
    } catch (error) {
        next(error)
    }
}

async function deleteMovie(id) {
    const sql = `DELETE FROM movies WHERE id = ${id}`
    const resp = await dbClient.query(sql)
    return resp.rows
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




 
async function getMovieHandler(req, res, next) {
    const id = req.params.id
    try {
        const movies = await getMovies(id)
        if(movies.length === 0 ) return res.status(204).send();
        res.json(movies)
    } catch (error) {
        next(error)
    }
}


 
async function updateMovieHandler(req, res, next) {
    const id = req.params.id
    const body = req.body;
    const updatedMovie = new Movie(body)
    try {
        const resp = await updateMovie(id, updatedMovie)
        res.json(resp)
    } catch (error) {
        next(error)
    }
}

async function updateMovie(id, updatedMovie) {
    const setValues = []
    const movie = await getMovie(id)
    const newMovie ={...movie,...updatedMovie} 

    const sql = `UPDATE movies 
                SET title = $1, release_date = $2 , poster_path = $3 , overview = $4 ,comment = $5
                WHERE id=${id}
                RETURNING *`
    
    const resp = await dbClient.query(sql,[newMovie.title,newMovie.release_date,newMovie.poster_path,newMovie.overview,newMovie.comment])
    return resp.rows
}
function deleteMovieHandler(req,res){
    let recipeid=req.params.id;
    let body=req.body;
    let sql=`DELETE FROM movies WHERE id=${id}`
    let value =[id]
    clinet.query(sql.value).then(result =>{
        res.status(204).send("delete")
    }).catch()

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
    this.comment=comment
}


app.listen(5000, 'localhost', function(err) {
    if (err) return console.log(err);
    else{
     dbClient.connect()
    console.log("Listening at http://localhost:%s", 5000);}
});
