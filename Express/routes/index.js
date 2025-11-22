const express = require("express");
const verify = require("../middleware/check");
const {register,login,getTasks,postTask,updateTask,deleteTask,gettaskbyQuery,sortTasks,gettaskforFirstpage} = require("../controllers/TaskController");
const router = express.Router();

router.post('/register',register);
router.post('/login',verify,login);
router.get('/tasks',verify,getTasks);


module.exports = router;
