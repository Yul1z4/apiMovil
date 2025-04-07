const Appointment = require('../models/Appointment');
const Service = require('../models/Service');
const User = require('../models/User');

// @desc    Get all appointments for a user
// @route   GET /api/appointments
// @access  Private
exports.getAppointments = async (req, res, next) => {
  try {
    const appointments = await Appointment.find({ user: req.user.id });
    res.status(200).json({
      success: true,
      count: appointments.length,
      data: appointments
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Get single appointment
// @route   GET /api/appointments/:id
// @access  Private
exports.getAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id
    });
    
    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Create new appointment
// @route   POST /api/appointments
// @access  Private
exports.createAppointment = async (req, res, next) => {
  try {
    const { name, services, date } = req.body;
    
    // Get user details
    const user = await User.findById(req.user.id);
    
    // Calculate total price
    const serviceDocs = await Service.find({ _id: { $in: services } });
    const total = serviceDocs.reduce((sum, service) => sum + service.price, 0);
    
    const appointment = await Appointment.create({
      user: req.user.id,
      name,
      clientName: user.name,
      clientPhone: user.phone,
      services,
      total,
      date
    });
    
    res.status(201).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Update appointment
// @route   PUT /api/appointments/:id
// @access  Private
exports.updateAppointment = async (req, res, next) => {
  try {
    let appointment = await Appointment.findOne({
      _id: req.params.id,
      user: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    // If services are being updated, recalculate total
    if (req.body.services) {
      const serviceDocs = await Service.find({ _id: { $in: req.body.services } });
      req.body.total = serviceDocs.reduce((sum, service) => sum + service.price, 0);
    }

    appointment = await Appointment.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    res.status(200).json({
      success: true,
      data: appointment
    });
  } catch (err) {
    next(err);
  }
};

// @desc    Delete appointment
// @route   DELETE /api/appointments/:id
// @access  Private
exports.deleteAppointment = async (req, res, next) => {
  try {
    const appointment = await Appointment.findOneAndDelete({
      _id: req.params.id,
      user: req.user.id
    });

    if (!appointment) {
      return res.status(404).json({
        success: false,
        error: 'Appointment not found'
      });
    }

    res.status(200).json({
      success: true,
      data: {}
    });
  } catch (err) {
    next(err);
  }
};