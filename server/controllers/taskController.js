const Task = require('../models/Task');

// Get Task
// Get /api/tasks

const getTasks = async (req,res) =>{
    const { search, status } = req.query;
  
  // Base query: only show tasks for current user
  let query = { user: req.user.id };

  // Add search logic (if search term exists)
  if (search) {
    query.title = { $regex: search, $options: 'i' }; // 'i' means case-insensitive
  }

  // Add filter logic (if status exists)
  if (status && status !== 'All') {
    query.status = status;
  }

  const tasks = await Task.find(query);
  res.status(200).json(tasks);
}

// Create Task
const createTask = async (req,res) =>{
    if(!req.body.title){
        return res.status(400).json({message: 'Please add a text field'});
    }

    const task = await Task.create({
        title: req.body.title,
        description: req.body.description,
        user: req.user.id
    });
    res.status(200).json(task);
}

// Update Task
const updateTask = async(req,res) =>{
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(400).json({message: 'Task not found'});
    if(task.user.toString() !== req.user.id){
        return res.status(401).json({message: 'User not authorized'});
    }
    const updatedTask = await Task.findByIdAndUpdate(req.params.id, req.body, {new: true});
    res.status(200).json(updatedTask);
}
const deleteTask = async (req,res) =>{
    const task = await Task.findById(req.params.id);
    if(!task) return res.status(400).json({message: 'Task not found'});
    if(task.user.toString() !== req.user.id){
        return res.status(401).json({message: 'User not authorized'});
    }
    await task.deleteOne();
    res.status(200).json({id: req.params.id});
}

module.exports = { getTasks, createTask, updateTask, deleteTask }