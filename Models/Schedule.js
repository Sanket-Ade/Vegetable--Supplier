import mongoose from 'mongoose';

const ScheduleSchema = new mongoose.Schema({
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    title: { type: String, required: true },
    date: { type: Date, required: true },
    type: { type: String, enum: ['harvest', 'pesticide', 'fertilizer', 'other'], default: 'other' },
    completed: { type: Boolean, default: false }
}, { timestamps: true });

export default mongoose.models.Schedule || mongoose.model('Schedule', ScheduleSchema);