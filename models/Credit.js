import mongoose from 'mongoose';

const creditSchema = new mongoose.Schema({
  employeeId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employee', required: true },
  employerId: { type: mongoose.Schema.Types.ObjectId, ref: 'Employer', required: true },
  milesSaved: { type: Number, required: true }, // Miles saved by employee
  method: { type: String, enum: ['public', 'carpool', 'wfh'], required: true }, // Travel method
  points: { type: Number, required: true }, // Points earned
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model('Credit', creditSchema);