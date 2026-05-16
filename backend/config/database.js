import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGO_URI;
    if (!mongoURI) throw new Error('MONGO_URI not defined in environment');

    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 5000,
    });

    console.log('MongoDB connected successfully');
  } catch (error) {
    console.error('MongoDB connection error:', error);

    // Provide actionable hint for common SRV/DNS failures
    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED' || /querySrv/i.test(error.message)) {
      console.error('DNS/SRV lookup failed. If you are behind a firewall or corporate network, this can block SRV lookups.');
      console.error('Options: 1) Ensure DNS/SRV is resolvable from this machine.');
      console.error("2) Use a standard connection string (mongodb://host:port/<dbname>) instead of mongodb+srv://");
    }

    // Do not exit process here; let the server run so endpoints can return informative errors.
  }
};

export default connectDB;
