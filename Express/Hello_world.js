const express = require('express');
const app = express();
const port = 3000;


app.use(express.json());
app.use(express.urlencoded({extended:false}));
app.use('/Api/users',require('./Routes/Api/users'));


app.listen(port,()=>{
    console.log(`The express server is running at <http://localhost>:,${port}`)
})