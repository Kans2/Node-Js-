const express = require('express');
const router = express.Router();




//json file vangrm
let movies = require('../../Movies.js');

//get all users data fetch

router.get("/movie",(req,res)=>{
    res.json(movies);
});



