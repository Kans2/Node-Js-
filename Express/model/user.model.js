const mongoose = require("mongoose");

const User = new mongoose.Schema(
   {
    name :{
        type : String,
        required :"name is required"
    },
    email:{
        type: String,
        required :"email is required"
    },
    password:{
        type :String,
        required:"password is requireds"
    }
   },
   {timestamps:true}
);

const newUser = mongoose.model('user',User);

export default newUser;
