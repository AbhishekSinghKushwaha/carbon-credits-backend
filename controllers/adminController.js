import Admin from '../models/Admin.js';
import Employer from '../models/Employer.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

export const registerAdmin = async (req, res) => {
  const { userName, email, password } = req.body;

  if (!userName || !email || !password) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const existingAdmin = await Admin.findOne({ userName });
    if (existingAdmin) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    const existingEmail = await Admin.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    const admin = new Admin({
      userName,
      email,
      password: hashedPassword,
    });

    await admin.save();

    res.status(201).json({ message: 'Admin registered', admin });
  } catch (error) {
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(400).json({ error: error.message });
  }
};

export const loginAdmin = async (req, res) => {
    const { userName, password } = req.body;
  
    if (!userName || !password) {
      return res.status(400).json({ error: 'Username and password are required' });
    }
  
    try {
      const admin = await Admin.findOne({ userName });
      if (!admin) {
        return res.status(404).json({ error: 'Admin not found' });
      }
  
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Invalid password' });
      }
  
      const token = jwt.sign(
        { id: admin._id, userName: admin.userName, role: 'admin' },
        process.env.JWT_SECRET,
        { expiresIn: '1h' }
      );
  
      res.json({
        message: 'Admin login successful',
        token,
        user: { id: admin._id, userName: admin.userName, role: 'admin' },
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

export const approveEmployer = async (req, res) => {
    const { userName } = req.params;
  
    if (!userName) {
      return res.status(400).json({ error: 'Employer username is required' });
    }
  
    try {
      const employer = await Employer.findOneAndUpdate(
        { userName },
        { bankApproved: true },
        { new: true }
      );
      if (!employer) {
        return res.status(404).json({ error: 'Employer not found' });
      }
  
      res.json({ message: 'Employer approved by admin', employer });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  export const validateAdminToken = async (req, res) => {
    try {
      const user = await Admin.findOne({ userName: req.user.userName });
      if (!user) {
        return res.status(404).json({ error: 'Admin not found' });
      }
      res.json({ user: { id: user._id, userName: user.userName, role: 'admin' } });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  };

  export const testEndpoint = (req, res) => {
    res.json({ message: 'Backend is running successfully! 🚀' });
  };