var http = require('http');  //module request

http.createServer(function(req,res){
    res.statusCode= 200;
   // res.setHeader = ('content-type', 'text/plain');
   res.write('Hello world! buddy')
   res.end();

}).listen(8080,()=>{
    console.log('server listen at 8080');
});

