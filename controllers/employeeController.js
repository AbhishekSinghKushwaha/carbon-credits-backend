import Employee from '../models/Employee.js';
import Employer from '../models/Employer.js';
import mongoose from 'mongoose';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

// Number of salt rounds for bcrypt hashing
const SALT_ROUNDS = 10;

export const registerEmployee = async (req, res) => {
  const { name, userName, email, password, employerUserName, homeLocation, workLocation } = req?.body;

  // Validate request body
  if (!name || !userName || !email || !password || !employerUserName || !homeLocation || !workLocation) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    // Check if userName already exists
    const existingEmployee = await Employee.findOne({ userName });
    if (existingEmployee) {
      return res.status(400).json({ error: 'Username already exists' });
    }

    // Check if email already exists
    const existingEmail = await Employee.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ error: 'Email already exists' });
    }

    // Check if employerUserName exists in Employer collection
    const employer = await Employer.findOne({ userName: employerUserName });
    if (!employer) {
      return res.status(404).json({ error: 'Employer not found' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

    // Create new employee with employerUserName
    const employee = new Employee({
      name,
      userName,
      email,
      password: hashedPassword,
      employerUserName, // Store the employer's userName
      homeLocation,
      workLocation,
    });

    // Save the employee to the database
    await employee.save();

    res.status(201).json({ message: 'Employee registered', employee });
  } catch (error) {
    // Handle duplicate key errors from MongoDB (e.g., if unique constraint fails)
    if (error.code === 11000) {
      const field = Object.keys(error.keyValue)[0];
      return res.status(400).json({ error: `${field} already exists` });
    }
    res.status(400).json({ error: error.message });
  }
};

export const loginEmployee = async (req, res) => {
  const { userName, password } = req.body;

  if (!userName || !password) {
    return res.status(400).json({ error: 'Username and password are required' });
  }

  try {
    const employee = await Employee.findOne({ userName });
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    const isMatch = await bcrypt.compare(password, employee.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid password' });
    }

    const token = jwt.sign(
      { id: employee._id, userName: employee.userName, role: 'employee' },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({
      message: 'Employee login successful',
      token,
      user: { id: employee._id, userName: employee.userName, role: 'employee' },
    });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  const { userName } = req.params;

  try {
    const employee = await Employee.findOne({userName: userName});
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Look up the employer using employerUserName
    const employer = await Employer.findOne({ userName: employee.employerUserName });
    if (!employer) return res.status(404).json({ error: 'Employer not found' });

    // Attach employer details to the response
    const employeeWithEmployer = {
      ...employee.toObject(),
      employer: { name: employer.name, userName: employer.userName },
    };

    res.json(employeeWithEmployer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployeebyId = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid employee ID format' });
  }

  try {
    const employee = await Employee.findById(id).populate('employerUserName', 'name');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Look up the employer using employerUserName
    const employer = await Employer.findOne({ userName: employee.employerUserName });
    if (!employer) return res.status(404).json({ error: 'Employer not found' });

    // Attach employer details to the response
    const employeeWithEmployer = {
      ...employee.toObject(),
      employer: { name: employer.name, userName: employer.userName },
    };

    res.json(employeeWithEmployer);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

// export const updateEmployee = async (req, res) => {
//   const { id } = req.params;
//   const { homeLocation, workLocation } = req.body;

//   try {
//     const employee = await Employee.findByIdAndUpdate(
//       id,
//       { homeLocation, workLocation },
//       { new: true }
//     );
//     if (!employee) return res.status(404).json({ error: 'Employee not found' });
//     res.json({ message: 'Employee updated', employee });
//   } catch (error) {
//     res.status(400).json({ error: error.message });
//   }
// };


export const updateEmployee = async (req, res) => {
  const { employeeId } = req.params;
  const { homeLocation, workLocation, distance, travelTime } = req.body;

  if (!employeeId || !homeLocation || !workLocation || distance == null || travelTime == null) {
    return res.status(400).json({ error: 'Employee ID, homeLocation, workLocation, distance, and travelTime are required' });
  }

  try {
    const employee = await Employee.findByIdAndUpdate(
      employeeId,
      { homeLocation, workLocation, distance, travelTime },
      { new: true }
    );

    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    res.json({ message: 'Employee updated successfully', employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const trackCarbonCredits = async (req, res) => {
  const { employeeId } = req.params;
  const { mode } = req.body;

  if (!employeeId || !mode) {
    return res.status(400).json({ error: 'Employee ID and transportation mode are required' });
  }

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) {
      return res.status(404).json({ error: 'Employee not found' });
    }

    // Define credits based on transportation mode
    const creditsMap = {
      'Public Transport': 10,
      'Bicycle': 15,
      'Walking': 20,
      'Carpool': 8,
      'Electric Vehicle': 5,
      'Car': 0,
    };

    const creditsEarned = creditsMap[mode] || 0;

    // Update employee's credits and add to transportation history
    employee.credits += creditsEarned;
    employee.transportationHistory.push({
      mode,
      creditsEarned,
      date: new Date(),
    });

    await employee.save();

    res.json({ message: `Earned ${creditsEarned} credits for using ${mode}`, employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const validateEmployeeToken = async (req, res) => {
  try {
    const user = await Employee.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'Employee not found' });
    }
    res.json({ user: { id: user._id, userName: user.userName, role: 'employee' } });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};