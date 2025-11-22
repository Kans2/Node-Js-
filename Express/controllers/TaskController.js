const tasks = require("../model/task.model");
const register = require("../model/user.model");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const register = async(req,res)=>{
      const { name , email , password } = req.body;
      try{
       if(!name || !email || !password){
        return res.status(400).json({message:"Fields are required"});
       }

       const findUser =await register.findOne({email});

       if(findUser){
        return res.status(201).json({message:"user is already exits"});
       }

       const salt =await bcrypt.genSalt(10);
       const hash = await bcrypt.hash(password,salt);

       const user = new register({
        name ,
        email,
        password:hash
       })

       await user.save();
       return res.status(200).json({message:"user created"})
      }catch(err){
       console.log(err);
       res.status(500).json({message :"Internal err",err});
      }
}

const login = async (req,res)=>{
    const { email , password } = req.body;
    try{
      const findUser = await register.findOne({email});
      
      if(!findUser){
        return res.status(404).json({message:"Invalid username or password"});
      }

      const isMatch = bcrypt.compare(password,findUser.password);

      if(!isMatch){
        return res.status(404).json({message:"Invalid username or password"});
      }

      
      const token = jwt.sign({userId:findUser._id}, process.env.JWT_SECRET);
      
      res.status(200).json({token : token , process.env.JWT_SECRET});

    }catch(err){
     console.log(err);
     res.status(500).json({message:"Something went wrong try again"});
    }
}

const getTasks = async (req,res) =>{
    try{

         const fetchTasks = await tasks.findOne({req.USERID});

         if(fetchTasks.length == 0){
             
            res.status(200).json({message :"no tasks found",[]});
         }
         res.status(200).json({message:"fetched tasks"},fetchTasks);

         }catch(err){
            console.log(err);
            res.status(500).json({message:"cannot fetch the data",err});
         }
    }

const postTask = async (req,res) =>{
         
        //  const { taskId, title, description, priority, status, deadline, assignedTo, tags, createdDate } = req.body;
      
         const newTask = new tasks({
          ...req.body ,
           user:req.USERID
         });

         await newTask.save();

         res.status(200).json({message:"task created successfully",newTask});
}

const updateTask = async(req,res) =>{
      const { id} = req.params;
      const updatedData = req.body;
    try{

        const findTask = await findOneAndUpdate(
            {id, req.USERiD},
            updatedData,

            { new: true, runValidators: true }
        )

         if(!findTask){
            res.status(404).json({message:"cannot find tasks"});
         }

    res.status(200).json({message:"updated task",taskFind});
    }catch(err){
     res.status(500).json({message:"cannot upddate a task"});
    }
}


const deleteTask = async(req,res) =>{
    const {id} = req.params;
    
    try{

        const deleteTask = await tasks.findByIdAndDelete(
            id
        )

        res.status(200).res.json({message:"deleted"});
        
    }catch(err){
       res.status(500).json({message:err});
    }
}

const gettaskbyQuery =async (req,res)=>{
    const { priority } = req.query;
    
    try{
        const findTask = await tasks.findOne({priority: priority});
        if(!findTask){
            return res.status(404).json({message:"Cannot found task"});
        }
        
        res.status(200).json({message:"founded",findTask});
    }catch(err){
        console.log(err);
        res.status(500).json({message:err});
    }

}

const sortTasks = async (req, res) => {

   const { sort} = req.query;
   try{
     const [field, order] = sort.split(":");
     let sortCretria = {};

     if(order === 'desc'){
        sortCretria[field] = -1;
     }else{
        sortCretria[field] = 1;
     }

     const sortedTasks = await tasks.find({}).sort(sortCretria);

     res.status(200).json({message:"sorted",sortTasks});

   }catch(err){
    console.log(err);
    res.status(500).json({message:err});
   }
}

const sortTasksdefault = async (req, res) => {
  const { sort } = req.query;
  try {
    // Handle missing sort query with default values
    const [field = "createdAt", order = "asc"] = (sort || "").split(":");
    // Validate field and order, if needed

    let sortCriteria = {};
    sortCriteria[field] = order === 'desc' ? -1 : 1;

    const sortedTasks = await tasks.find({}).sort(sortCriteria); // Use correct model

    res.status(200).json({ message: "sorted", sortedTasks });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


const gettaskforFirstpage = async(req,res)=>{
   const {page = 1 , limit = 5} = req.query;
   
   try{
     if(!page && !limit){
        return res.status(501).json({message:"cannot find page limit"});
     }
     
    const pageNumber = parseInt(page) ;
    const limitNumber = parseInt(limit) ;

    const skip =( pageNumber - 1) * limitNumber;
    
    const taskForpage = await tasks.find({}).skip(skip).limit(limitNumber);
     res.status(200).json({message:"fetched",taskForpage});

   }catch(){
   res.status(500).json({ message: err.message });
   }
}


module.exports = {register,login,getTasks,postTask , updateTask ,deleteTask,gettaskbyQuery,sortTasks,sortTasksdefault,gettaskforFirstpage};