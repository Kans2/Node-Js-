const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({extended:false}));    //middleware

app.use('/users',require('./routes/api/users'));


app.listen(port,()=>{
    console.log(`The express server is running at <http://localhost>:,${port}`)
})