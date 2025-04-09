import Employee from '../models/Employee.js';
import mongoose from 'mongoose';

export const registerEmployee = async (req, res) => {
  const { name, employerId, homeLocation, workLocation } = req?.body;

  try {
    const employee = new Employee({ name, employerId, homeLocation, workLocation });
    await employee.save();
    res.status(201).json({ message: 'Employee registered', employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployee = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ error: 'Invalid employee ID format' });
  }

  try {
    const employee = await Employee.findById(id).populate('employerId', 'name');
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json(employee);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const updateEmployee = async (req, res) => {
  const { id } = req.params;
  const { homeLocation, workLocation } = req.body;

  try {
    const employee = await Employee.findByIdAndUpdate(
      id,
      { homeLocation, workLocation },
      { new: true }
    );
    if (!employee) return res.status(404).json({ error: 'Employee not found' });
    res.json({ message: 'Employee updated', employee });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};