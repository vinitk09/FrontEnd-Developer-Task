const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')
const User = require('../models/User')

const generateToken = (id) => {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' })
}

const registerUser = async (req, res) => {
    const { email, password, name } = req.body;

    // 1. Check for fields
    if (!email || !password || !name) {
        return res.status(400).json({ message: 'Please add all fields' })
    }

    // 2. Check if user exists
    // (This code was previously outside the function!)
    const userExists = await User.findOne({ email });
    if (userExists) {
        return res.status(400).json({ message: 'User already exists' });
    }

    // 3. Hash password (You need this!)
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user
    const user = await User.create({
        name,
        email,
        password: hashedPassword // Store the hashed password, not plain text
    });

    if (user) {
        res.status(201).json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id),
        })
    } else {
        res.status(400).json({ message: 'Invalid user data' });
    }
}; 

const loginUser = async (req, res) => {
    const { email, password } = req.body;
    const user = await User.findOne({ email });


    if (user && (await bcrypt.compare(password, user.password))) {
        res.json({
            _id: user.id,
            name: user.name,
            email: user.email,
            token: generateToken(user._id)
        })
    } else {
        res.status(400).json({ message: 'Invalid credentials' });
    }
};

module.exports = { registerUser, loginUser }