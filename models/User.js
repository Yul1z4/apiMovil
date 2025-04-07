const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, ingrese su nombre'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Por favor, ingrese su email'],
    unique: true,
    lowercase: true,
    validate: [validator.isEmail, 'Por favor, ingrese un email valido']
  },
  phone: {
    type: String,
    required: [true, 'Por favor, ingrese su número'],
    trim: true
  },
  address: {
    type: String,
    required: [true, 'Please enter your address'],
    trim: true
  },
  password: {
    type: String,
    required: [true, 'Por favor, ingrese su contraseña'],
    minlength: [6, 'la contraseña no debe ser menor a 6 carácteres'],
    select: false
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// Generate JWT token
userSchema.methods.generateAuthToken = function() {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

// Check password
userSchema.methods.correctPassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('User', userSchema);