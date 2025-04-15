import express from 'express';
import { registerEmployer, loginEmployer, getEmployer, tradeCredits, getAllEmployers, getEmployerbyId, validateEmployerToken } from '../controllers/employerController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerEmployer); // Register a new employer
//router.put('/:id/approve', approveEmployer); // Bank approves employer
router.get('/:userName', authenticateToken, getEmployer); // Protect the route
router.post('/trade', authenticateToken, tradeCredits);
router.post('/login', loginEmployer);
router.get('/get/:id', getEmployerbyId); // Get employer details and employees
// router.post('/trade', tradeCredits); // Trade credits between employers
router.get('/', getAllEmployers);
router.get('/validate', authenticateToken, validateEmployerToken);

export default router;