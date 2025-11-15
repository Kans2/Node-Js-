const http = require("http");
const fs = require("fs");
const data = require("./data.json");
const { json } = require("stream/consumers");



const server = http.createServer((req,res)=>{
   
    
    if(req.url == "/"){
         res.writeHead(200, {"content-type":"text/plain"});
        res.end("Home page");
    }else if(req.url == "/about"){
         res.writeHead(200, {"content-type":"text/plain"});
        res.end("About page");
    }else if(req.url == "/contact"){
        res.writeHead(200, { "Content-Type": "application/json" });
        res.end(JSON.stringify(data));
    }
    else{
        res.end("Not  Found page");
    }
})


server.listen(5000,()=>{
    console.log("server listing at 5000");
})