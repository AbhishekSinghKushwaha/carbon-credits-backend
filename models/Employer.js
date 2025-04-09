import mongoose from 'mongoose';

const employerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  bankApproved: { type: Boolean, default: false }, // Approved by carbon credit bank
  credits: { type: Number, default: 0 }, // Total credits for trading
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Employer', employerSchema);