import Employer from '../models/Employer.js';
import Employee from '../models/Employee.js';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

export const registerEmployer = async (req, res) => {
  const { name, userName, email, password } = req.body;

  try {
    // Check if userName already exists
    const existingEmployer = await Employer.findOne({ userName });
    if (existingEmployer) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists (optional, since email is unique in the schema)
    const existingEmail = await Employer.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new employer with hashed password
    const employer = new Employer({
      name,
      userName,
      email,
      password: hashedPassword, // Store the hashed password
    });

    // Save the employer to the database
    await employer.save();

    res.status(201).json({ message: 'Employer registered', employer });
  } catch (error) {
    // Handle duplicate key errors from MongoDB (e.g., if unique constraint fails)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(400).json({ error: error.message });
  }
};

export const loginEmployer = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const employer = await Employer.findOne({ userName });
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    const isMatch = await bcrypt.compare(password, employer.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: employer._id, userName: employer.userName, role: 'employer' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Employer login successful',
      token,
      user: { id: employer._id, userName: employer.userName, role: 'employer' },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const approveEmployer = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findByIdAndUpdate(
      id,
      { bankApproved: true },
      { new: true }
    );
    if (!employer) return res.status(404).json({ error: 'Employer not found' });
    res.json({ message: 'Employer approved by bank', employer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployer = async (req, res) => {
  const { userName } = req.params; // Get userName from URL params

  // Validate userName
  if (!userName || typeof userName !== 'string') {
    return res.status(400).json({ error: 'Invalid or missing userName' });
  }

  try {
    // Find employer by userName
    const employer = await Employer.findOne({ userName });
    if (!employer) return res.status(404).json({ error: 'Employer not found' });

    // Find all employees associated with this employer using employerUserName
    const employees = await Employee.find({ employerUserName: userName });

    res.json({ employer, employees });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployerbyId = async (req, res) => {
  const { id } = req.params;

  try {
    const employer = await Employer.findById(id);
    if (!employer) return res.status(404).json({ error: 'Employer not found' });
    const employees = await Employee.find({ employerUserName: employer.userName });
    res.json({ employer, employees });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const tradeCredits = async (req, res) => {
  const { sellerUserName, buyerUserName, credits } = req.body;

  try {
    const seller = await Employer.findOne({userName: sellerUserName});
    const buyer = await Employer.findOne({userName: buyerUserName});

    if (!seller || !buyer) return res.status(404).json({ error: 'Employer not found' });
    if (seller.credits < credits) return res.status(400).json({ error: 'Insufficient credits' });

    seller.credits -= credits;
    buyer.credits += credits;

    await seller.save();
    await buyer.save();

    res.json({ message: 'Credits traded successfully', seller, buyer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const tradeCredits = async (req, res) => {
//   const { sellerId, buyerId, credits } = req.body;

//   try {
//     const seller = await Employer.findById(sellerId);
//     const buyer = await Employer.findById(buyerId);

//     if (!seller || !buyer) return res.status(404).json({ error: 'Employer not found' });
//     if (seller.credits < credits) return res.status(400).json({ error: 'Insufficient credits' });

//     seller.credits -= credits;
//     buyer.credits += credits;

//     await seller.save();
//     await buyer.save();

//     res.json({ message: 'Credits traded successfully', seller, buyer });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };

export const getAllEmployers = async (req, res) => {
  try {
    const employers = await Employer.find({}, 'userName name bankApproved credits');
    res.json(employers);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validateEmployerToken = async (req, res) => {
  try {
    const user = await Employer.findOne({ userName: req.user.userName });
    if (!user) {
      return res.status(404).json({ error: 'Employer not found' });
    }
    res.json({ user: { id: user._id, userName: user.userName, role: 'employer' } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const buyCredits = async (req, res) => {
  const { userName, credits } = req.body;

  if (!userName || !credits || credits <= 0) {
    return res.status(400).json({ error: 'Invalid request: userName and credits are required, and credits must be positive' });
  }

  try {
    const employer = await Employer.findOne({ userName });
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    // Simulate buying credits from a central pool (e.g., the system)
    // In a real system, you might deduct from a central pool or involve payment
    employer.credits += credits;
    await employer.save();

    res.json({ message: `Successfully bought ${credits} credits`, employer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};