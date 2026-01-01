const dotenv = require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors')
const app = express();

app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: false}));

mongoose.connect(process.env.MONGO_URI).then(() => console.log("MongoDB connected")).catch(err => console.log(err));

// Routes
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/tasks', require('./routes/taskroutes'));

const port =  5000;
app.listen(port, () => console.log(`Server started on port ${port}`))
