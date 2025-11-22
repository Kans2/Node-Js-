const express = require('express');
const app = express();
const movies = require('./Movies');
const PORT = process.env.PORT || 3000;



app.use(express.json());  //middle ware

app.use(express.static('public'));
//app.use(express.urlencoded({extended:false}));


//GET
app.get('/movies',(req,res)=>{
  res.statusCode(200);
  res.json(movies);
})




//specific id use panni get
/*
app.get('/movies/:id', (req, res) => {
    const { id } = req.params;
    const movie = movies.find(m => m.id === parseInt(id));

    if (movie) {
        res.json(movie);
    } else {
        res.status(404).json({ message: 'Movie not found' });
    }
}); */

//POST
app.post('/movies/:id',(req,res)=>{
    
   
    const {id} = req.params;
    const {name,year,runtime} = req.body;

    

    res.json({
        message:"new movie added and created succesfuly",
        movies:{
            id:id,
            name:name,
            year:year,
            runtime:runtime
        }
    });
})







app.listen(PORT,()=>{
    console.log("The server os running at locolhost:3000");
})
