const validateRegister = (req, res, next) => {
  const { name, email, password } = req.body;

  if (!name || name.trim().length < 2) {
    return res.status(400).json({
      success: false,
      message: 'Full name is required and must be at least 2 characters long.',
    });
  }

  if (!email || !/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
    return res.status(400).json({
      success: false,
      message: 'A valid email address is required.',
    });
  }

  if (!password || password.length < 6) {
    return res.status(400).json({
      success: false,
      message: 'Password must be at least 6 characters long.',
    });
  }

  next();
};

const validateLogin = (req, res, next) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({
      success: false,
      message: 'Please provide both email and password.',
    });
  }

  next();
};

const validateBooking = (req, res, next) => {
  const { showId, seatIds } = req.body;

  if (!showId) {
    return res.status(400).json({
      success: false,
      message: 'Show ID is required.',
    });
  }

  if (!seatIds || !Array.isArray(seatIds) || seatIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'Please select at least one seat to book.',
    });
  }

  next();
};

module.exports = {
  validateRegister,
  validateLogin,
  validateBooking,
};
