const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Por favor, presione el nombre del servicio'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Please enter service description']
  },
  price: {
    type: Number,
    required: [true, 'Please enter service price'],
    min: [0, 'Price cannot be negative']
  },
  duration: {
    type: Number,
    required: [true, 'Please enter duration in minutes'],
    min: [15, 'Minimum duration is 15 minutes']
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Service', serviceSchema);