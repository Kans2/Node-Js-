//in nodejs file is module isolated
//load module in another file, we use require function
//when indexjs executed , module also executed
const add = (a,b) =>{
    return a + b;
}

const sub = (a , b)=>{
    return a - b ;
}

//pattern 2
// module.exports = (a,b) =>{
//     return a + b;
// }


module.exports = {add ,sub};