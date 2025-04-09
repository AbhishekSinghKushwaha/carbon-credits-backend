import express from 'express';
import { submitCredit, getEmployeeCredits } from '../controllers/creditController.js';

const router = express.Router();

router.post('/submit', submitCredit); // Submit a new credit entry
router.get('/employee/:employeeId', getEmployeeCredits); // Get all credits for an employee

export default router;