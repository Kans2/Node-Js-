const mongoose = require("mongoose");

async function ConnectoDb(cb){
   try{
      await mongoose.connect(process.env.MONGO_URI,{
        useNewUrlParser: true,
        useNewUnifiedTopology: true
      });

      cb();
      console.log("database connected...");
   }catch(err){
          
      console.log(err);
      process.exit(1);
   }
}

module.exports = ConnectoDb;