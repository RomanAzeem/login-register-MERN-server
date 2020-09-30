const asyncHandler = require('../middleware/async');
const User = require('../models/User');

// @desc      Register user
// @route     POST /api/users/register
// @access    Public
exports.register_User = asyncHandler(async (req, res, next) => {
  console.log();
  const { name, password } = req.body;

  // Create user
  const user = await User.create({
    name,
    password,
  });
  res.status(200).json({
    success: true,
    data: user,
  });
});

// @desc      Login User
// @route     POST  /api/auth/login
// @access    Public
exports.login_User = asyncHandler(async (req, res, next) => {
  const { name, password } = req.body;
  // Check if the fields are empty
  if (!name || !password) {
    return next(
      res.status(400).json({
        success: false,
        message: 'Please Provide Name and Password',
      })
    );
  }

  //Check the User exist or not
  const isUser = await User.findOne({ name }).select('+password');

  if (!isUser) {
    return next(
      res.status(401).json({
        success: false,
        message: 'Inavlid Credentials',
      })
    );
  }
  const isPassMatch = await isUser.matchPassword(password);

  if (!isPassMatch) {
    return next(
      res.status(401).json({
        success: false,
        message: 'Inavlid Credentials',
      })
    );
  }
  res.status(200).json({
    success: true,
    data: isUser,
  });
});
