import Payment from "../../Models/paymentModel.js";
import Member from "../../Models/membersModel.js"
import { verifyToken } from "../../middleware/authMiddleware.js";
import moment from "moment"
export const processPayment = async (req, res) => {
  const { memberId, method, trainerFee } = req.body;

  try {
    const member = await Member.findById(memberId).populate('membership_plan_id');
    if (!member) return res.status(404).json({ message: 'Member not found' });

    const plan = member.membership_plan_id;
    if (!plan) return res.status(400).json({ message: 'Membership plan not assigned to member' });

    if (!plan.duration_in_days || typeof plan.duration_in_days !== 'number') {
      return res.status(400).json({ message: 'Invalid duration_in_days in membership plan' });
    }

    if (trainerFee === undefined || isNaN(trainerFee)) {
      return res.status(400).json({ message: 'Trainer fee is required and must be a number' });
    }

    const paymentDate = new Date();
    const nextDueDate = new Date(paymentDate);
    nextDueDate.setDate(nextDueDate.getDate() + plan.duration_in_days);

    member.membership_start_date = paymentDate;
    member.membership_end_date = nextDueDate;
    member.feeStatus = true;
    await member.save();

    const invoiceNumber = `INV-${Date.now()}`;
    const totalAmount = plan.price + trainerFee;

    const payment = new Payment({
      memberId,
      planId: plan._id,
      amount: plan.price,
      trainerFee,
      totalAmount,
      paymentDate,
      nextDueDate,
      method,
      invoice_number: invoiceNumber,
    });

    await payment.save();

    return res.status(201).json({
      message: 'Payment processed successfully',
      payment,
      member,
    });

  } catch (error) {
    console.error('Error processing payment:', error);
    return res.status(500).json({ message: 'Internal server error' });
  }
};

export const getRevenueSummary = async (req, res) => {
  try {
    const totalAgg = await Payment.aggregate([
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalTrainerFee: { $sum: "$trainerFee" },
        },
      },
    ]);

    // CURRENT MONTH revenue
    const now = new Date();
    const startOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);
    const endOfMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);

    const monthlyAgg = await Payment.aggregate([
      {
        $match: {
          paymentDate: {
            $gte: startOfMonth,
            $lt: endOfMonth,
          },
        },
      },
      {
        $group: {
          _id: null,
          monthlyRevenue: { $sum: "$amount" },
        },
      },
    ]);

    res.json({
      totalRevenue: totalAgg[0]?.totalRevenue || 0,
      totalTrainerFee: totalAgg[0]?.totalTrainerFee || 0,
      currentMonthRevenue: monthlyAgg[0]?.monthlyRevenue || 0,
    });
  } catch (err) {
    console.error("Revenue summary error:", err);
    res.status(500).json({ message: "Failed to get revenue summary" });
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
      console.log('▶ payment.memberId:', payment.memberId); 
      const data = {
        memberName: payment.memberId?.name || "No Name",
        specialCode: payment.memberId?.special_code || "N/A", 
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

export const getMemberPaymentSummary = async (req, res) => {
  try {
    const memberId = req.params.id;

    const member = await Member.findById(memberId)
      .populate('membership_plan_id', 'plan_name price')
      .populate('trainer_id', 'name fee');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const planPrice = member.membership_plan_id?.price || 0;
    const trainerFee = member.trainer_id?.fee || 0;
    const totalAmount = planPrice + trainerFee;

    res.json({
      memberName: member.name,
      plan: member.membership_plan_id?.plan_name,
      planPrice,
      trainer: member.trainer_id?.name,
      trainerFee,
      totalAmount,
    });
  } catch (err) {
    console.error("Error calculating payment summary:", err);
    res.status(500).json({ message: 'Internal server error' });
  }
};



