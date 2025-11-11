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
    Jwt.verify(req.token ,"secretkey",(err,authData)=>{
        if(err){
            res.sendStatus(403);
        }else {
            res.json({
                message:"post created",
                authData ,
            }); 
        }
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
    const bearerHeader = req.headers["authorization"]
    if(typeof bearerHeader !== 'undefined'){
        const bearerToken = bearerHeader.split(" ")[1]; 
        req.token = bearerToken 
        next();

    }else{
        res.sendStatus(403 )
    }
}





app.listen(port,()=>{
    console.log("server running at:",{port});
})
