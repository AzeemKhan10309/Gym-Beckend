  import mongoose from 'mongoose';
  const PaymentSchema = new mongoose.Schema({
    memberId: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
    planId: { type: mongoose.Schema.Types.ObjectId, ref: 'MembershipPlan', required: true },
     trainerFee: {
    type: Number,
    required: true
  },
    amount: { type: Number, required: true },
    paymentDate: { type: Date, default: Date.now },
    nextDueDate: {type: Date,required: true,},
    method: { type: String ,enum:[`cash`,`card`,`upi`]},
    invoice_number: { type: String }
  });

  export default mongoose.model('Payment', PaymentSchema);