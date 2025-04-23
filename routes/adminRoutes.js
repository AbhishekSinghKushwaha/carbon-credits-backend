import express from 'express';
import { registerAdmin, loginAdmin, approveEmployer, validateAdminToken } from '../controllers/adminController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerAdmin); // Register a new admin
router.post('/login', loginAdmin); // Admin login
router.put('/approve-employer/:userName', authenticateToken, approveEmployer); // Approve an employer by userName
router.get('/validate', authenticateToken, validateAdminToken);

export default router;