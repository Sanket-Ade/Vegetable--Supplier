const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env.local
require('dotenv').config({ path: path.resolve(__dirname, '.env.local') });

// --- SCHEMAS ---
// We define them here so the script doesn't depend on your Next.js models folder
const RequirementSchema = new mongoose.Schema({
  storeId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  itemName: String,
  category: String,
  quantityNeeded: Number,
  targetPrice: Number,
  status: { type: String, default: 'open' }
});

const UserSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: { type: String, default: 'user' },
  phoneNumber: String,
  city: String
});

const Requirement = mongoose.models.Requirement || mongoose.model('Requirement', RequirementSchema);
const User = mongoose.models.User || mongoose.model('User', UserSchema);

async function seedData() {
  const MONGO_URI = process.env.MONGODB_URI;

  if (!MONGO_URI) {
    console.error("❌ Error: MONGODB_URI not found in .env.local");
    console.log("Make sure your .env.local file has: MONGODB_URI=mongodb+srv://...");
    process.exit(1);
  }

  try {
    console.log("⏳ Connecting to MongoDB...");
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected successfully.");

    // 1. Find or Create a Store Owner
    // We need a user with role 'store' to "own" these requirements
    let store = await User.findOne({ role: 'store' });
    
    if (!store) {
      console.log("Creating a dummy store owner for testing...");
      store = await User.create({
        name: "Yavatmal City Mart",
        email: "contact@citymart.com",
        role: "store",
        phoneNumber: "9876543210",
        city: "Yavatmal"
      });
    }

    // 2. Clear old requirements (Optional: remove this if you want to keep old data)
    await Requirement.deleteMany({});
    console.log("🧹 Cleared old requirements.");

    // 3. Create fresh dummy requirements
    const dummyReqs = [
      {
        storeId: store._id,
        itemName: "Tomato",
        category: "Vegetables",
        quantityNeeded: 150,
        targetPrice: 20,
        status: "open"
      },
      {
        storeId: store._id,
        itemName: "Onion",
        category: "Vegetables",
        quantityNeeded: 400,
        targetPrice: 25,
        status: "open"
      },
      {
        storeId: store._id,
        itemName: "Wheat",
        category: "Grains",
        quantityNeeded: 1200,
        targetPrice: 30,
        status: "open"
      },
      {
        storeId: store._id,
        itemName: "Potato",
        category: "Vegetables",
        quantityNeeded: 300,
        targetPrice: 15,
        status: "open"
      }
    ];

    await Requirement.insertMany(dummyReqs);
    console.log(`🚀 Success! Inserted 4 requirements for ${store.name}.`);
    
    console.log("\nRefresh your Farmer Dashboard to see the new blue cards!");
    process.exit();

  } catch (error) {
    console.error("❌ Database Error:", error.message);
    if (error.message.includes('ECONNREFUSED')) {
      console.log("\n💡 TIP: Check if your IP address is whitelisted in MongoDB Atlas Network Access.");
    }
    process.exit(1);
  }
}

seedData();