const adminOnly = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      success: false,
      message: 'Access forbidden: Administrator privileges required for this action.',
    });
  }
  next();
};

module.exports = { adminOnly };
