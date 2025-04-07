const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.ObjectId,
    ref: 'User',
    required: true
  },
  name: {
    type: String,
    required: [true, 'Por favor, ingrese el nombre de la cita']
  },
  clientName: {
    type: String,
    required: true
  },
  clientPhone: {
    type: String,
    required: true
  },
  services: [{
    type: mongoose.Schema.ObjectId,
    ref: 'Service',
    required: true
  }],
  total: {
    type: Number,
    required: true,
    min: [0, 'Total cannot be negative']
  },
  date: {
    type: Date,
    required: [true, 'Por favor, seleccione una fecha y hora']
  },
  status: {
    type: String,
    enum: ['pendiente', 'confirmado', 'completado', 'cancelado'],
    default: 'pendiente'
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Populate services when querying
appointmentSchema.pre(/^find/, function(next) {
  this.populate('services');
  next();
});

module.exports = mongoose.model('Appointment', appointmentSchema);