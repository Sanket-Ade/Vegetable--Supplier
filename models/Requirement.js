

import mongoose from 'mongoose';

const RequirementSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  itemName: { type: String, required: true },
  category: { type: String, required: true },
  quantityNeeded: { type: Number, required: true },
  // ADDED: Tracks total progress so we can update status automatically
  quantityFulfilled: { type: Number, default: 0 }, 
  targetPrice: { type: Number },
  deadline: { type: Date },
  status: { 
    type: String, 
    enum: ['open', 'fulfilled'], // Added enum for better data integrity
    default: 'open' 
  },
  // THE NEW LEDGER
  contributions: [{
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    farmerName: String,
    phoneNumber: String,
    quantity: Number,
    date: { type: Date, default: Date.now }
  }]
}, { timestamps: true });

const Requirement = mongoose.models.Requirement || mongoose.model('Requirement', RequirementSchema);
export default Requirement;