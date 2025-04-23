import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },
  userName: { type: String, required: true, unique: true, index: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  employerUserName: { type: String, required: true, index: true },
  credits: { type: Number, default: 0 },
  homeLocation: { 
    type: String, 
    required: true,
    validate: {
      validator: function (v) {
        return v && v.trim().length > 0;
      },
      message: 'Home location cannot be empty',
    },
  },
  workLocation: { 
    type: String, 
    required: true,
    validate: {
      validator: function (v) {
        return v && v.trim().length > 0;
      },
      message: 'Work location cannot be empty',
    },
  },
  distance: { type: Number, required: true, default: 0 },
  travelTime: { type: Number, default: 0 },
  transportationHistory: [
    {
      mode: { type: String, required: true },
      creditsEarned: { type: Number, required: true },
      date: { type: Date, default: Date.now },
    },
  ],
  createdAt: { type: Date, default: Date.now },
  lastCreditUpdate: { type: Date }
});

export default mongoose.model('Employee', employeeSchema);