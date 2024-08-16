const express = require('express');
const app = express();

const port = 8050;



app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/Api/Movies',require('./Routes/Api/Movie.js'));



app.listen(port,()=>{
    console.log("The server os running at locolhost:8050");
})
