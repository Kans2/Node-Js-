const express = require('express');
const router = express.Router();  //router use
const uuid = require('uuid');



//store the user info in variable

let users = require('../../Users');


//Get method
router.get('/',(req,res)=>{
    res.json(users);
});


//Get filter  method
router.get('/:id',(req,res)=>{
    const found = users.some(user=>{user.id === parseInt((req.params.id))});
    if(found){
        res.json(users.filter(user=>{user.id === parseInt((req,params,id))}));
    }else{
        res.sendStatus(404);
    }
})


//new user
//POST method
router.post('/',(req,res)=>{
    const newuser = {
        id: uuid.v4(),
        name:req.body.name,
        email:req.body.email
    }

    if(!newuser.name || !newuser.email){
        return res.sendStatus(404);
    }
    users.push(newuser);
    res.json(users);
})


//UPDATE METHOD(put)
router.put('/',(req,res)=>{

    const found = users.some(user=>{user.id === parseInt((req.params.id))});

    if(found){
        const updateUser = req.body;
        users.forEach(user=>{
            if(user.id === parseInt(req.params.id)){
                user.name = updateUser.name ? updateUser.name : user.name
                user.email = updateUser.email ? updateUser.email : user.email
                res.json({msg:'Updted succesfuly',user})
            }
        })
    }

})


//DELETE METHOD

router.delete('/:id',(req,res)=>{
    const found = users.some(user=>{user.id === parseInt((req.params.id))});
    if(found){
        res.json(users.filter(user=>{user.id === parseInt((req,params,id))}));
    
      res.json({
        msg:'User Deleted',
        users
       })
}else{
       res.sendStatus(404);
    }

})




module.exports= router;