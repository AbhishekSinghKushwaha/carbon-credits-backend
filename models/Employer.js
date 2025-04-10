import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true},
  email: { type: String, required: true, unique: true},
  password: { type: String, requried: true },
  bankApproved: { type: Boolean, default: false }, // Approved by carbon credit bank
  credits: { type: Number, default: 0 }, // Total credits for trading
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Employer', employerSchema);