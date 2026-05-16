import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  // Keep first/last name for compatibility but make optional
  firstName: { type: String },
  lastName: { type: String },
  // Username is required and used by frontend
  username: { type: String, required: true, unique: true },
  // Full name (single-field) accepted from frontend signup
  fullName: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin', 'member'], default: 'member' }
}, { timestamps: true });

export default mongoose.model('User', userSchema);
