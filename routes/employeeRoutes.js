import express from 'express';
import { registerEmployee, getEmployee, updateEmployee, getEmployeebyId } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/register', registerEmployee); // Register a new employee
router.get('/get/:id', getEmployeebyId); // Get employee details
router.get('/:userName', getEmployee)
router.put('/:id', updateEmployee); // Update employee locations

export default router;