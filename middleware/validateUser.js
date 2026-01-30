/*
 * VALIDATION MIDDLEWARE:
 * This middleware validates user data before it reaches the controller
 * It can be used selectively on routes that need validation
 */

const validateUser = (req, res, next) => {
  const { name, email, age } = req.body;
  const errors = [];

  // Validate name
  if (name && (name.length < 2 || name.length > 50)) {
    errors.push('Name must be between 2 and 50 characters');
  }

  // Validate email format
  if (email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Invalid email format');
    }
  }

  // Validate age
  if (age) {
    const ageNum = parseInt(age);
    if (isNaN(ageNum) || ageNum < 18 || ageNum > 100) {
      errors.push('Age must be a number between 18 and 100');
    }
  }

  if (errors.length > 0) {
    return res.status(400).json({
      success: false,
      errors: errors
    });
  }

  next();
};

module.exports = validateUser;