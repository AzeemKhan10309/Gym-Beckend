import Payment from "../../Models/paymentModel.js";
import Member from"../../Models/membersModel.js"
import { verifyToken } from "../../middleware/authMiddleware.js";
import moment from "moment"
export const processPayment = async (req, res) => {
  const { memberId, method } = req.body;

  try {
    const member = await Member.findById(memberId).populate('membership_plan_id');
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const plan = member.membership_plan_id;
    if (!plan) return res.status(400).json({ message: 'Membership plan not assigned to member' });

    if (!plan.duration_in_days || typeof plan.duration_in_days !== 'number') {
      return res.status(400).json({ message: 'Invalid duration_in_days in membership plan' });
    }

    //Calculate dates
    const paymentDate = new Date();
    const nextDueDate = new Date(paymentDate);
    nextDueDate.setDate(nextDueDate.getDate() + plan.duration_in_days);

    // Update member’s membership dates
    member.membership_start_date = paymentDate;
    member.membership_end_date = nextDueDate;
    await member.save();

    // Create payment record
    const invoiceNumber = `INV-${Date.now()}`;
    const payment = new Payment({
      memberId,
      planId: plan._id,
      amount: plan.price,
      paymentDate,
      nextDueDate,
      method,
      invoice_number: invoiceNumber,
    });

    await payment.save();
  await Member.findByIdAndUpdate(memberId, { feeStatus: true });

    return res.status(201).json({
      message: "Payment processed successfully",
      payment
    });

  } catch (error) {
    console.error("Error processing payment:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
 
export const getAllPayments = async (req, res) => {
    try {
        const payments = await Payment.find();
        res.status(200).json(payments);
    } catch (error) {
        console.error("Error fetching payments:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getPaymentById = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json(payment);
    } catch (error) {
        console.error("Error fetching payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const updatePayment = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedPayment = await Payment.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );
        if (!updatedPayment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json(updatedPayment);
    } catch (error) {
        console.error("Error updating payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deletePayment = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await Payment.findByIdAndDelete(id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }
        res.status(200).json({ message: "Payment deleted successfully" });
    }
    catch (error) {
        console.error("Error deleting payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
// Exporting the functions to be used in routes
export const verifyPayment = async (req, res) => {
    const { id } = req.params;

    try {
        const payment = await
        Payment.findById(id);
        if (!payment) {
            return res.status(404).json({ message: "Payment not found" });
        }   
        if (payment.status === 'Pending') {
            payment.status = 'Verified';
            await payment.save();
            res.status(200).json({ message: "Payment verified successfully", payment });
        } else {
            res.status(400).json({ message: "Payment already verified" });
        }
    }
    catch (error) {
        console.error("Error verifying payment:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const feereminder = async (req, res) => {
  try {
    const today = moment().startOf("day");
    const upcoming = moment().add(5, "days").endOf("day");

    const payments = await Payment.find({
      nextDueDate: { $lte: upcoming }
    })
      .populate("memberId")
      .sort({ nextDueDate: 1 });

    const overdue = [];
    const upcomingList = [];

    payments.forEach(payment => {
      const data = {
        memberName: payment.memberId?.name || "No Name",
        dueDate: moment(payment.nextDueDate).format("YYYY-MM-DD"),
      };

      if (moment(payment.nextDueDate).isBefore(today)) {
        overdue.push(data);
      } else {
        upcomingList.push(data);
      }
    });

    res.json({
      success: true,
      overdue,
      upcoming: upcomingList,
    });
  } catch (error) {
    console.error("Error in feereminder controller:", error);
    res.status(500).json({ success: false, message: error.message });
  }
};

