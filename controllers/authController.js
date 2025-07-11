const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const Joi = require('joi');

exports.register = async (req, res) => {
  const schema = Joi.object({
    name: Joi.string().required(),
    email: Joi.string().email().required(),
    password: Joi.string().min(6).required(),
    lat: Joi.number().required(),
    lng: Joi.number().required()
  });

  const { error } = schema.validate(req.body);
  if (error) return res.status(400).json({ message: error.details[0].message });

  const { name, email, password, lat, lng } = req.body;

  const hashedPassword = await bcrypt.hash(password, 10);

  const newUser = new User({
    name,
    email,
    password: hashedPassword,
    image: req.file?.path,
    location: {
      type: "Point",
      coordinates: [lng, lat],
    },
  });

  await newUser.save();

  res.status(201).json({ message: 'تم التسجيل بنجاح!' ,
    user: {
    name: newUser.name,
    lat: newUser.location.coordinates[1],
    lng: newUser.location.coordinates[0]
  }
  });
};

exports.login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password)))
    return res.status(400).json({ message: 'الايميل او كلمة السر خطأ!' });

  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

  res.cookie('token', token, {
    httpOnly: true,
    secure: process.env.COOKIE_SECURE, // change to true in production with HTTPS
    sameSite: 'Lax'
  });

  return res.json({
  message: 'تم تسجيل الدخول بنجاح!',
  user: {
    name: user.name,
    lat: user.location.coordinates[1],
    lng: user.location.coordinates[0]
  }
});
};

exports.logout = (req, res) => {
  res.clearCookie('token');
  res.json({ message: 'Logged out' });
};
