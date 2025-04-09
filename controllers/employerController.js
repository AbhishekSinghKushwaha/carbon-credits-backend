import Employer from '../models/Employer.js';
import Employee from '../models/Employee.js';

export const registerEmployer = async (req, res) => {
  const { name } = req.body;

  try {
    const employer = new Employer({ name });
    await employer.save();
    res.status(201).json({ message: 'Employer registered', employer });
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
  const { id } = req.params;

  try {
    const employer = await Employer.findById(id);
    if (!employer) return res.status(404).json({ error: 'Employer not found' });
    const employees = await Employee.find({ employerId: id });
    res.json({ employer, employees });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const tradeCredits = async (req, res) => {
  const { sellerId, buyerId, credits } = req.body;

  try {
    const seller = await Employer.findById(sellerId);
    const buyer = await Employer.findById(buyerId);

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