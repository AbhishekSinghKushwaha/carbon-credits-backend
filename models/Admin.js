import mongoose from 'mongoose';

const adminSchema = new mongoose.Schema({
  userName: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Store hashed password
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Admin', adminSchema);