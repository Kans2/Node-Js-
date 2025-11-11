const http = require('http');  //module request

const server = http.createServer((req,res)=>{

   res.statusCode= 200;
   res.setHeader = ('Content-Type', 'text/plain');
   res.write('Hello world! buddy');
   res.end();

})

server.listen(8080,()=>{
    console.log('server listen at 8080');
});

