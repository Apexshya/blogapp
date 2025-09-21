const jwt = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const User = require('../models/User');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
    ),
    httpOnly: true
  };
  
  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
  res.cookie('jwt', token, cookieOptions);
  
  user.password = undefined;
  
  res.status(statusCode).json({
    status: 'success',
    token,
    data: {
      user
    }
  });
};

exports.register = async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      // Return a more detailed error message
      const errorMessages = errors.array().map(error => error.msg);
      return res.status(400).json({ 
        error: errorMessages.join(', ') 
      });
    }
    
    const { username, email, password, role } = req.body;
    
    const userExists = await User.findOne({ $or: [{ email }, { username }] });
    if (userExists) {
      return res.status(400).json({ error: 'User already exists' });
    }
    
    const user = await User.create({
      username,
      email,
      password,
      role: role || 'user'
    });
    
    createSendToken(user, 201, res);
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ error: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }
    
    const user = await User.findOne({ email }).select('+password');
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    
    createSendToken(user, 200, res);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    res.status(200).json({
      status: 'success',
      data: {
        user
      }
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};




// const jwt = require('jsonwebtoken');
// const { validationResult } = require('express-validator');
// const User = require('../models/User');

// const signToken = (id) => {
//   return jwt.sign({ id }, process.env.JWT_SECRET, {
//     expiresIn: process.env.JWT_EXPIRES_IN
//   });
// };

// const createSendToken = (user, statusCode, res) => {
//   const token = signToken(user._id);
//   const cookieOptions = {
//     expires: new Date(
//       Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
//     ),
//     httpOnly: true
//   };
  
//   if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  
//   res.cookie('jwt', token, cookieOptions);
  
//   user.password = undefined;
  
//   res.status(statusCode).json({
//     status: 'success',
//     token,
//     data: {
//       user
//     }
//   });
// };

// exports.register = async (req, res) => {
//   try {
//     const errors = validationResult(req);
//     if (!errors.isEmpty()) {
//       const errorMessages = errors.array().map(error => error.msg);
//       return res.status(400).json({ 
//         error: errorMessages.join(', ') 
//       });
//     }
    
//     const { username, email, password, role } = req.body;
    
//     // Check if user already exists
//     const userExists = await User.findOne({ $or: [{ email }, { username }] });
//     if (userExists) {
//       return res.status(400).json({ error: 'User already exists' });
//     }
    
//     // For security, only allow admin creation if there are no existing admins
//     // or if the request comes from an existing admin (you'd need to implement this)
//     const adminCount = await User.countDocuments({ role: 'admin' });
//     let userRole = 'user';
    
//     // Allow admin creation only if no admins exist yet
//     // In a real app, you'd want a more secure way to create the first admin
//     if (role === 'admin' && adminCount === 0) {
//       userRole = 'admin';
//     }
    
//     const user = await User.create({
//       username,
//       email,
//       password,
//       role: userRole
//     });
    
//     createSendToken(user, 201, res);
//   } catch (error) {
//     console.error('Registration error:', error);
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.login = async (req, res) => {
//   try {
//     const { email, password } = req.body;
    
//     if (!email || !password) {
//       return res.status(400).json({ error: 'Please provide email and password' });
//     }
    
//     const user = await User.findOne({ email }).select('+password');
    
//     if (!user || !(await user.correctPassword(password, user.password))) {
//       return res.status(401).json({ error: 'Incorrect email or password' });
//     }
    
//     createSendToken(user, 200, res);
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };

// exports.getMe = async (req, res) => {
//   try {
//     const user = await User.findById(req.user.id);
//     res.status(200).json({
//       status: 'success',
//       data: {
//         user
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// };








