import express from 'express';
import { registerEmployee, getEmployee, updateEmployee, getEmployeebyId, loginEmployee, validateEmployeeToken } from '../controllers/employeeController.js';
import { authenticateToken } from '../middleware/auth.js';

const router = express.Router();

router.post('/register', registerEmployee); // Register a new employee
router.get('/get/:id', authenticateToken, getEmployeebyId); // Get employee details
router.post('/login', loginEmployee);
// router.get('/:id', authenticateToken, getEmployee);
router.get('/:userName', getEmployee)
router.put('/:id', updateEmployee); // Update employee locations
router.get('/validate', authenticateToken, validateEmployeeToken);

export default router;