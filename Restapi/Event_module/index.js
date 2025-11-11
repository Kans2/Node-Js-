const EvenEMitter = require("events");

//we can on more events
const emmiter = new EvenEMitter();


//what event to happen
emmiter.on("order-pizza",(size,ingredant)=>{
    console.log(`Order recieved ! Baking a ${size} with ${ingredant}`);
})

emmiter.on("order-pizza",(size)=>{
    if(size == "Large"){
       console.log("serving juice");
    }
})

console.log("after me you can execute");
emmiter.emit("order-pizza","Large","mushroom");