import express from 'express';
import mongoose from 'mongoose';
import dotenv from 'dotenv';
import cors from 'cors';
// import employeeRoutes from './routes/employeeRoutes.js';
// import employerRoutes from './routes/employerRoutes.js';
// import creditRoutes from './routes/creditRoutes.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(cors());

// app.use('/api/employees', employeeRoutes);
// app.use('/api/employers', employerRoutes);
// app.use('/api/credits', creditRoutes);

const PORT = process.env.PORT || 5000;

mongoose.connect(process.env.MONGO_URI || uri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
  })
  .catch(err => console.error(err));


// // Start Server
// app.listen(PORT, () => {
//     console.log(`Server is running on http://localhost:${PORT}`);
// });
