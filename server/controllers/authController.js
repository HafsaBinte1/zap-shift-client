const User = require('../models/User');
const generateToken = require('../utils/generateToken');

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password, phone, role, location, vehicleType } = req.body;

    if (!name || !email || !password || !phone || !role || !location?.city || !location?.area) {
      return res.status(400).json({ success: false, message: 'Missing required fields' });
    }

    if (!['merchant', 'deliveryMan'].includes(role)) {
      return res.status(400).json({ success: false, message: 'Invalid role' });
    }

    const existing = await User.findOne({ email: email.toLowerCase() });
    if (existing) {
      return res.status(409).json({ success: false, message: 'An account with that email already exists' });
    }

    const user = await User.create({
      name,
      email,
      password,
      phone,
      role,
      location,
      vehicleType: role === 'deliveryMan' ? vehicleType : undefined
    });

    const token = generateToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.status(201).json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, message: 'Email and password are required' });
    }

    const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid email or password' });
    }

    const token = generateToken(user);
    const safeUser = user.toObject();
    delete safeUser.password;

    res.json({ success: true, data: { token, user: safeUser } });
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res) => {
  res.json({ success: true, data: { user: req.user } });
};

exports.updateMe = async (req, res, next) => {
  try {
    const { name, phone, location } = req.body;
    if (name) req.user.name = name;
    if (phone) req.user.phone = phone;
    if (location) {
      req.user.location = {
        city: location.city ?? req.user.location.city,
        area: location.area ?? req.user.location.area,
        address: location.address ?? req.user.location.address
      };
    }
    await req.user.save();
    res.json({ success: true, data: { user: req.user } });
  } catch (err) {
    next(err);
  }
};
