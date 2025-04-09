import express from 'express';
import { registerEmployee, getEmployee, updateEmployee } from '../controllers/employeeController.js';

const router = express.Router();

router.post('/register', registerEmployee); // Register a new employee
router.get('/get/:id', getEmployee); // Get employee details
router.put('/:id', updateEmployee); // Update employee locations

export default router;