import mongoose from 'mongoose';

const AttendanceSchema = new mongoose.Schema({
  memberId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Member',
    required: true,
  },
  marked_by: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    required: true,
  },
  date: {
    type: Date,
    required: true,
    default: () => new Date().setHours(0, 0, 0, 0),
  },
  status: {
    type: String,
    enum: ['present', 'absent'],
    default: 'present',
  }
}, {
  timestamps: true
});

AttendanceSchema.index({ memberId: 1, date: 1 }, { unique: true });

export default mongoose.model('Attendance', AttendanceSchema);
