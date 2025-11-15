import mongoose from "mongoose";


const taskSchema = new mongoose.Schema({ 
    taskId: {
        type:Integer ,
        required: [true, "task id is required"]
    }
},{timestamps:true});

const Task = mongoose.model('Task',taskSchema);

module.exports = Task;

