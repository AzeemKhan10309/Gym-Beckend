import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  title: { type: String, required: true },
  body: { type: String, required: true },
  sentBy: { type: String, default: 'admin' },
  date: { type: Date, default: Date.now },
 targetType: { type: String, enum: ['all', 'member', 'trainer'], default: 'all' },
  targetId: { type: mongoose.Schema.Types.ObjectId, refPath: 'targetType', default: null },});

export default mongoose.model('Message', messageSchema);
