import mongoose from 'mongoose';

/**
 * Roles: 'buyer' (default) can browse/save/contact agents; 'agent' can also
 * post listings (Task 10); 'admin' is never assignable via public signup —
 * only granted by direct DB edit or a future admin-only endpoint.
 */
const USER_ROLES = ['buyer', 'agent', 'admin'];

const UserSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true, minlength: 2, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    },
    password: { type: String, required: true, select: false },
    phone: { type: String, trim: true },
    role: { type: String, enum: USER_ROLES, default: 'buyer' },
  },
  { timestamps: true }
);

export const User = mongoose.model('User', UserSchema);
export { USER_ROLES };
