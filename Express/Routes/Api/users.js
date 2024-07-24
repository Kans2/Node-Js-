const express = require('express');
const router = express.Router();  //router use
const uuid = require('uuid');


//store the user info in variable

let users = require('../../Users');


//Get the  all data

router.get('/',(req,res)=>{
    res.json(users)
})


module.exports= router;