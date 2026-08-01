import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema({
  farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  quantity: { type: Number, required: true },
  pricePerUnit: { type: Number, required: true },
  marketPriceAtListing: { type: Number },
  status: { type: String, default: 'available' }
}, { timestamps: true });

// THIS LINE IS THE KEY:
// It checks if the model already exists before creating a new one
const Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);

export default Product;