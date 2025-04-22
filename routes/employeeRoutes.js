import express from 'express';
import { registerEmployee, getEmployee, updateEmployee, getEmployeebyId, loginEmployee, validateEmployeeToken, trackCarbonCredits } from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerEmployee); // Register a new employee
router.get('/get/:id', authenticateToken, getEmployeebyId); // Get employee details
router.post('/login', loginEmployee);
// router.get('/:id', authenticateToken, getEmployee);
router.get('/:userName', getEmployee)
router.put('/:employeeId', authenticateToken, updateEmployee); // Update employee locations
router.get('/validate', authenticateToken, validateEmployeeToken);
router.post('/:employeeId/track-credits', authenticateToken, trackCarbonCredits);

export default router;