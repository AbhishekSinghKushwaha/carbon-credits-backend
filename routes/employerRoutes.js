import express from 'express';
import { registerEmployer, approveEmployer, getEmployer, tradeCredits, getAllEmployers, getEmployerbyId } from '../controllers/employerController.js';

const router = express.Router();

router.post('/register', registerEmployer); // Register a new employer
router.put('/:id/approve', approveEmployer); // Bank approves employer
router.get('/:userName', getEmployer); // Get employer details and employees
router.get('/get/:id', getEmployerbyId); // Get employer details and employees
router.post('/trade', tradeCredits); // Trade credits between employers
router.get('/', getAllEmployers);

export default router;