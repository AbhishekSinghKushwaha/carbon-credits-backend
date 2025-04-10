import Credit from '../models/Credit.js';
import Employee from '../models/Employee.js';
import Employer from '../models/Employer.js';

export const submitCredit = async (req, res) => {
  const { employeeId, milesSaved, method } = req.body;

  try {
    const employee = await Employee.findById(employeeId);
    if (!employee) return res.status(404).json({ error: 'Employee not found' });

    // Look up employer using employerUserName
    const employer = await Employer.findOne({ userName: employee.employerUserName });
    if (!employer) return res.status(404).json({ error: 'Employer not found' });

    // Calculate points based on method
    const rates = { public: 2, carpool: 1.5, wfh: 3 };
    const points = milesSaved * (rates[method] || 1);

    const credit = new Credit({
      employeeId,
      employerId: employer._id, // Still store employerId in Credit for reference
      milesSaved,
      method,
      points,
    });

    employee.credits += points;
    employer.credits += points;

    await credit.save();
    await employee.save();
    await employer.save();

    res.status(201).json({ message: 'Credit submitted', credit, employee, employer });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const getEmployeeCredits = async (req, res) => {
  const { employeeId } = req.params;

  try {
    const credits = await Credit.find({ employeeId }).sort({ createdAt: -1 });
    res.json(credits);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};