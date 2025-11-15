const fs = require('fs');

const http = require("http");


const server = http.createServer((req,res)=>{
    // const html = fs.readFileSync("./index.html");
  
    res.writeHead(200,{"Content-type": "text/html"});
    fs.createReadStream("./index.html","utf8").pipe(res);
    //res.end(html);
})

server.listen(8000,()=>{
    console.log("Server is running at 8000");
})