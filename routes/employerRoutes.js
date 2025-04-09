import express from 'express';
import { registerEmployer, approveEmployer, getEmployer, tradeCredits } from '../controllers/employerController.js';

const router = express.Router();

router.post('/register', registerEmployer); // Register a new employer
router.put('/:id/approve', approveEmployer); // Bank approves employer
router.get('/:id', getEmployer); // Get employer details and employees
router.post('/trade', tradeCredits); // Trade credits between employers

export default router;