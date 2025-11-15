const fs = require("fs");

//to read a file 
// const data = fs.readFileSync("./file.txt","utf-8");
// console.log(data);


//path and callback function
fs.readFile("./file.txt","utf-8",(err,data)=>{
    if(err){
        console.log(err);
    }else{
        console.log(data);
    }
})

fs.writeFileSync("./file.txt","Hello vision",{flag :"a"},(err)=>{
    if(err){
        console.log(err);
    }else{
        console.log("file writed");
    }
})