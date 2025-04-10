import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true }, // Ensure userName is unique
  email: { type: String, required: true, unique: true }, // Optional: Make email unique
  password: { type: String, required: true }, // Store hashed password
  employerUserName: { type: String, required: true }, // Store the employer's userName (string)
  homeLocation: { type: String, required: true },
  workLocation: { type: String, required: true },
  credits: { type: Number, default: 0 },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Employee', employeeSchema);