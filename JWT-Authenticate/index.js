const express = require('express');
const Jwt = require("jsonwebtoken");
const app = express();

const port = 3000;


app.get('/api',(req,res)=>{
    res.json({
        message :"Ready to go!",
    });
});

app.post('/api/posts',verifytoken,(req,res)=>{
    res.json({
        message:"post created"
    })
})

app.post('/api/login',(req,res)=>{
    const user = {
        id:1,
        name:"Joe",
        email:"xyzgmail.com"
    }

    //token to sign
    Jwt.sign({user:user},"secretkey",(err,token)=>{
        res.json({
            token,
        })
    })
})


function verifytoken(req,res ,next){
    const bearheader = req.headers["authorization"]
    if(typeof bearheader !== 'undefined'){
        const bearheader = bearheader.spilit{''}[1]
        req.token = bearheader
        next();

    }else{
        res.sendStatus(404)
    }
}





app.listen(port,()=>{
    console.log("server running at:",{port});
})
