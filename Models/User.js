import mongoose from 'mongoose';

const UserSchema = new mongoose.Schema({
    // Store & Personal Info
    name: { type: String, required: true },
    email: { type: String, unique: true, sparse: true }, 
    phoneNumber: { type: String, unique: true, required: true },
    password: { type: String }, 
    role: {
      type: String,
      enum: ['farmer', 'shopkeeper'],
      required: true
    },
    address: { type: String },

    // OTP Fields for Farmers (Login)
    otp: { type: String },
    otpExpires: { type: Date },

    // OTP Fields for Shopkeepers (Password Reset)
    resetOTP: { type: String },
    resetOTPExpires: { type: Date }
}, { timestamps: true }); // Options go here as the 2nd argument

// This prevents creating a new model if one already exists during development
export default mongoose.models.User || mongoose.model('User', UserSchema);