const express = require("express");
const multer  = require('multer')
const {rateLimit} = require("express-rate-limit");
const Redis  = require("ioredis");
const data =  require("./task.json");
const users = require("./register.json");
const jwt = require("jsonwebtoken");
const port = 8000;
const fs = require("fs");
const {verify} = require("./middleware/verifyToken");

//learn the pattern syntax


const redis = new Redis();




const app = express();



const limiter = rateLimit({
  windowMs : 60 * 60 * 1000,
  max:7,
  message:"Too many requests from this IP please try again later"
});

app.use(limiter);

app.use(express.json());


// Multer Storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./uploads");
  },
  filename: function (req, file, cb) {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});


const upload = multer({ storage });



app.get('/tasks/v1',(req,res)=>{
     res.status(200).json({message:"this is an old version Move to new Verison v2 "});
});

app.get('/tasks/v2',(req,res)=>{
  res.status(200).json({message:"now you are in version 2 you can access new features"});
});

app.get('/',(req,res)=>{
   res.send("Home page");
})


app.post('/register',(req,res)=>{

  const {name,email} = req.body;
  // generate a simple unique id for the user
  const id = Date.now();
  const newUser = { id, name, email };

  users.push(newUser);
  
  fs.writeFile('./register.json',JSON.stringify(users, null ,2),"utf-8",(err)=>{
    if(err) {
      console.log(err);
      res.status(500).json({message:"error founded"});
    }else{
      
      res.status(200).json({message:"user created suceesfully",user:newUser});
    }
  });
  
});

app.get('/users',(req,res)=>{
  try{
    res.status(200).json({users});
  }catch(err){
    console.log(err);
    res.status(500).json({message:"cannot get the users",err})
  }
});

app.post('/login',(req,res)=>{
  
  const { name , email} = req.body;

  try{
     const finduser = users.find((e)=> 
       e.name == name && e.email == email
    );

    if(!finduser){
      return res.status(401).json({message:"Invalid username or password"});
    }
    
    // sign token with `userID` to match task data field (`userID`)
    const token = jwt.sign({ userID: finduser.id }, "Key123");

    res.status(200).json({ token:token });
    
  }catch(err){
   console.log(err);
   res.status(500).json({message:"Invalid token"});
  }
});

// app.get('/api/tasks',(req,res)=>{
//   console.log(req.query);
//   res.send("Task list ")
// })
// //middleware for err
// app.use((req,res,next)=>{
//    const err = new Error('something broken');
//    next(err);
// })
// //middleware for err
// app.use((err,req,res,next)=>{
//     console.error(err.message);
//     res.status(500).json({message:err});
// })

// //middleware next
// app.use((req,res,next)=>{
//       console.log(`get request is initiated ${req.method} for the ${req.url}`);
//       next();
// })

// //middleware authentication
// app.use((req,res,next)=>{
//       const authHeader = req.headers["authorization"];

//       if(!authHeader){
//        console.log("❌ No Authorization header found");
//     return res.status(401).json({ message: "Unauthorized - Missing token" });

//       }

//     if(authHeader !== "mysecretToken"){
//       console.log("❌ Invalid Token");
//       return res.status(403).json({message:"Forbidden not authorized"});
//     }

//     console.log("Authenticated successfully");
//     next();

// });

// //Add custom logging, authentication simulation, and global error handler to your task API

app.get('/tasks', verify, async (req, res) => {
  try {
    const userID = req.userID;
    const cacheKey = `tasks:${userID}`;

    // 1. Check redis cache first
    const cachedData = await redis.get(cacheKey);
    if (cachedData) {
      return res.status(200).json({
        message: "founded (from cache)",
        userTask: JSON.parse(cachedData)
      });
    }

    // 2. If not cached → fetch from DB
    const userTask = data.filter(e => e.userID === userID);

    if (!userTask) {
      return res.status(404).json({ message: "cant found" });
    }

    // 3. Save result in Redis (cache for 5 minutes)
    await redis.set(cacheKey, JSON.stringify(userTask), 'EX', 300);

    return res.status(200).json({
      message: "founded",
      userTask
    });

  } catch (err) {
    res.status(400).json({ err });
  }
});



app.get('/tasks/:id', (req, res) => {
  const { id } = req.params;
  try {
    const findTask = data.find((e) => e.taskId == id);

    if (!findTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    res.status(200).json({ message: "found", findTask });
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


app.post('/tasks', (req, res) => {
  try {
    const { taskId, title, description, priority, status, deadline, assignedTo, tags, createdDate } = req.body;

    if (!taskId || !title) {
      return res.status(400).json({ message: "taskId and title are required" });
    }

    const newTask = { taskId, title, description, priority, status, deadline, assignedTo, tags, createdDate };

    data.push(newTask); // Add to array (note: not saved to file)

    fs.writeFile("./task.json", JSON.stringify(data, null, 2), "utf-8", (err) => {
  if (err) {
    console.error("Error writing file:", err);
    return res.status(500).json({ message: "Failed to save task" });
  }

  res.status(201).json({
    message: "Added new task and saved to file",
    task: newTask
  });
});
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.put('/tasks/:id', (req, res) => {
  const { id } = req.params;
  const { title, description, priority, status, deadline, assignedTo, tags, createdDate } = req.body;

  try {
    const taskFind = data.find((e) => e.taskId == id);

    if (!taskFind) {
      return res.status(404).json({ message: "Task not found" }); // ✅ Added return
    }

    if (title) taskFind.title = title;
    if (description) taskFind.description = description;
    if (priority) taskFind.priority = priority;
    if (status) taskFind.status = status;
    if (deadline) taskFind.deadline = deadline;
    if (assignedTo) taskFind.assignedTo = assignedTo;
    if (tags) taskFind.tags = tags;
    if (createdDate) taskFind.createdDate = createdDate;

    return res.status(200).json({  // ✅ Changed 201 → 200 (201 = Created; 200 = Updated)
      message: "Task updated successfully",
      updatedTask: taskFind
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: err.message });
  }
});

app.delete('/tasks/:id', (req, res) => {
  const { id } = req.params;

  try {
    const findTask = data.find((e) => e.taskId == id);

    if (!findTask) {
      return res.status(404).json({ message: "Task not found" });
    }

    // ✅ Filter out the deleted task from the data array
    const updatedData = data.filter((e) => e.taskId != id);

    // ✅ Save updated data to file
    fs.writeFile("./task.json", JSON.stringify(updatedData, null, 2), (err) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: "Error writing to file" });
      }

      res.status(200).json({ message: "Task deleted successfully" });
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Upload Image for Specific Task
app.post("/tasks/:id/upload", upload.single("avatar"), (req, res) => {
  const taskId = req.params.id;   // ✅ Correct place to read id
  const file = req.file;

  if (!file) {
    return res.status(400).json({ message: "No file uploaded" });
  }

  const filePath = file.path;

  // Load JSON data
  const data = JSON.parse(fs.readFileSync("./task.json"));

  // Find task by id (your structure may vary)
  const taskIndex = data.findIndex((t) => t.userID === taskId);

  if (taskIndex === -1) {
    return res.status(404).json({ message: "User/task not found" });
  }

  // Add image path
  data[taskIndex].image = filePath;

  // Write updated data
  fs.writeFileSync("./task.json", JSON.stringify(data, null, 2));

  res.status(200).json({
    message: "Image uploaded & path saved",
    imagePath: filePath
  });
});


// app.get('/task',(req,res)=>{
//   const {filter , value } = req.query;

//   try{

//      if(!filter && !value) {
//     return res.send(data);
//   }

//   if(filter && value){
//     const findTask = data.filter((e)=> e[filter].includes(value));

//     if(!findTask){
//       res.status(404).json({message:"not found task"});
//     }

//     res.status(200).json({findTask});
//   }

//   }catch(err){
//       console.log(err);
//       res.status(500).json({message:err});
//   }

// });
 
// app.get('/task',(req,res)=>{
//   const{ priority } = req.query;
//   try{
//         if(!priority){
//           return res.status(200).json({data});
//         }
//         if(priority){
//           const findTask = data.filter((e) => e.priority === priority);
//           res.status(200).json({findTask});
//         }
//   }catch(err){
//       console.log(err);
//       res.status(500).json({message:err});
//   }
// });

// // app.get('/task', (req, res) => {
// //   const { sort } = req.query;
// //   const result = [...data];

// //   try {
// //     if (!sort) {
// //       return res.status(200).json({ data }); // Return all data if no sort
// //     }
// //     if(sort){
// //         const [field, order] = sort.split(':');

// //     if (!field || !order || !['asc', 'desc'].includes(order)) {
// //       return res.status(400).json({ message: 'Invalid sort parameter' });
// //     }

// //     result.sort((a, b) => {
// //       const aVal = new Date(a[field]);
// //       const bVal = new Date(b[field]);

// //       if (order === 'desc') {
// //         return bVal - aVal;
// //       }
// //       return aVal - bVal;
// //     });

// //     res.status(200).json({ data: result });
// //     }

   
// //   } catch (err) {
// //     console.error(err);
// //     res.status(500).json({ message: err.message });
// //   }
// // });



// //pagination


// app.get('/task',(req,res)=>{

//   //syntax for pagination
//       // const startIndex = (page - 1) * limit;
//       //   const endIndex = page * limit;
//   const {page,limit} = req.query;

//   try{
//     if(isNaN(page) && isNaN(limit)){
//       return res.status(404).json({message:"not a Number"});
//     }
//     if(page && limit){
//         const startIndex = (page - 1) * limit;
//         const endIndex = page * limit;
//         const  paginated = data.slice(startIndex,endIndex);

//          res.json({
//     page,
//     limit,
//     total: data.length,
//     tasks: paginated
//   });
        
//     }

//   }catch(err){      
//     console.log(err);
//     res.status(500).json({message:err});

//   }

// });


app.listen(port,()=>{
    console.log(`server listen at ${port}`);
})





