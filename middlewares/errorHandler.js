const errorHandler = (err, req, res, next) => {
    // Log to console for dev
    console.error(err.stack.red);
    
    // Mongoose bad ObjectId
    if (err.name === 'CastError') {
      return res.status(400).json({ 
        error: 'Resource not found' 
      });
    }
    
    // Mongoose duplicate key
    if (err.code === 11000) {
      return res.status(400).json({ 
        error: 'Duplicate field value entered' 
      });
    }
    
    // Mongoose validation error
    if (err.name === 'ValidationError') {
      const messages = Object.values(err.errors).map(val => val.message);
      return res.status(400).json({ 
        error: messages 
      });
    }
    
    // Default to 500 server error
    res.status(500).json({ 
      error: 'Server Error' 
    });
  };
  
  module.exports = errorHandler;