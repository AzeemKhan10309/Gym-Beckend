import Member from "../../Models/membersModel.js";
import Payment from "../../Models/paymentModel.js";
import DietPlan from "../../Models/dietPlanModel.js";
import WorkoutPlan from "../../Models/workoutModel.js";
import Attendance from "../../Models/attendanceModel.js";
import bcrypt from "bcryptjs";
import QRCode from 'qrcode';

import { sendWelcomeEmail } from "../../utils/sendMail.js";

export const registerMember = async (req, res) => {
  try {
    

    const {
      name,
      email,
      phone,
      password,
      date_of_birth,
      membership_start_date,
      membership_end_date,
      membership_plan_id,
      trainer_id,
      isFeePaid
    } = req.body;

    const existingMember = await Member.findOne({ email });
    if (existingMember) {
      return res.status(400).json({ message: "Member already exists" });
    }

    const generateNumericCode = (length = 6) => {
      const min = Math.pow(10, length - 1);
      const max = Math.pow(10, length) - 1;
      return Math.floor(Math.random() * (max - min + 1)) + min;
    };

    let special_code;
    let isDuplicate = true;
    while (isDuplicate) {
      special_code = generateNumericCode();
      const existing = await Member.findOne({ special_code });
      if (!existing) isDuplicate = false;
    }

    const finalPassword = password || 'default123';
    const hashedPassword = await bcrypt.hash(finalPassword, 10);
    const profileImagePath = req.file ? req.file.path : null;

    const newMember = new Member({
      name,
      email,
      phone,
      password: hashedPassword,
      date_of_birth,
      membership_start_date,
      membership_end_date,
      membership_plan_id,
      trainer_id,
      special_code,
      isFeePaid: isFeePaid === 'true' || isFeePaid === true,
      profileImage: profileImagePath,
    });

    await newMember.save();

    const qrData = newMember._id.toString();
    const qrImageData = await QRCode.toDataURL(qrData, { width: 200 });

    newMember.qrCode = qrImageData;
    await newMember.save();

    await sendWelcomeEmail(email, name, special_code, qrImageData);

    res.status(201).json({
      message: "Member registered successfully",
      member: {
        id: newMember._id,
        name: newMember.name,
        email: newMember.email,
        phone: newMember.phone
      }
    });

  } catch (error) {
    console.error("❌ Error registering member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const loginMember = async (req, res) => {
  const { email, password } = req.body;

  try {
    const member = await Member.findOne({ email });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    const isPasswordValid = await bcrypt.compare(password, member.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }
    res.status(200).json({
      message: "Member logged in successfully",
      member: {
        id: member._id,
        name: member.name,
        email: member.email,
        phone: member.phone
      }
    });
  }
  catch (error) {
    console.error("Error logging in member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const getAllMembers = async (req, res) => {
  try {
    const members = await Member.find({}, '-password') // Exclude password
      .populate('trainer_id', 'name')
      .populate('membership_plan_id', 'plan_name')
      .select('name email phone profileImage isFeePaid date_of_birth membership_start_date membership_end_date trainer_id membership_plan_id');

    res.status(200).json({ users: members });
  } catch (error) {
    console.error("Error fetching members:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const getMemberById = async (req, res) => {
  const { query } = req.params;

  try {
    const member = await Member.findOne({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { special_code: query }
      ]
    });
    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const updateMember = async (req, res) => {
  const { id } = req.params;
  const { name, email, phone, password, date_of_birth, membership_start_date, membership_end_date, membership_plan_id, trainer_id } = req.body;

  try {
    const updatedMember = await Member.findByIdAndUpdate(id, { name, email, phone, password, date_of_birth, membership_start_date, membership_end_date, membership_plan_id, trainer_id }, { new: true });
    if (!updatedMember) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json({
      message: "Member updated successfully",
      member: updatedMember
    });
  } catch (error) {
    console.error("Error updating member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}
export const deleteMember = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedMember = await Member.findByIdAndDelete(id);

    if (!deletedMember) {
      return res.status(404).json({ message: "Member not found" });
    }

    await Payment.deleteMany({ memberId: id });
    await DietPlan.deleteMany({ memberId: id });
    await WorkoutPlan.deleteMany({ memberId: id });
    await Attendance.deleteMany({ memberId: id });

    res.status(200).json({ message: "Member and related data deleted successfully" });
  } catch (error) {
    console.error("Error deleting member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
}

export const autoSearch = async (req, res) => {
  try {
    const query = req.query.q;
    console.log("🔍 Search query:", query);

    if (!query) return res.json([]);

    const results = await Member.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { special_code: { $regex: query, $options: 'i' } }
      ]
    }).select('name special_code isFeePaid').limit(10); 

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

export const getMemberPaymentDetails = async (req, res) => {
  const memberId = req.params.id;
  console.log("Getting member for ID:", memberId);

  try {
    const member = await Member.findById(memberId)
      .populate('membership_plan_id')
      .populate('trainer_id');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    // Correct logging
    console.log("MembershipPlan:", member.membership_plan_id);
    console.log("Trainer:", member.trainer_id);

    // Access the correct populated fields
    const membershipPrice = member.membership_plan_id?.price || 0;
    const trainerFee = member.trainer_id?.fee || 0;
    const totalAmount = membershipPrice + trainerFee;

    res.json({
      name: member.name,
      email: member.email,
      membershipPlan: member.membership_plan_id
        ? {
          name: member.membership_plan_id.plan_name,
          price: member.membership_plan_id.price,
          duration: member.membership_plan_id.duration_in_days
        }
        : null,
      trainer: member.trainer_id
        ? {
          name: member.trainer_id.name,
          fee: trainerFee
        }
        : null,
      totalAmount
    });
  } catch (err) {
    console.error("Error in getMemberPaymentDetails:", err);
    res.status(500).json({ message: 'Server error' });
  }
};
// GET /api/members/:id
export const getMemberDetails = async (req, res) => {
  const { id } = req.params;

  try {
    const member = await Member.findById(id).populate("membership_plan_id", "planName").populate("trainer_id", "name").populate("assignedDietPlan", "planName diet").populate("assignedWorkoutPlan", "title days")


    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

export const memberDashboard = async (req, res) => {
 try {
    const today = new Date();

    const totalMembers = await Member.find();
    const activeMembers = await Member.find({
      membership_start_date: { $lte: today },
      membership_end_date: { $gte: today },
      isFeePaid: true,
    });
    const unpaidMembers = await Member.find({ isFeePaid: false });
    const expiredMembers = await Member.find({
      membership_end_date: { $lt: today },
    });

    res.status(200).json({
      totalMembers,
      activeMembers,
      unpaidMembers,
      expiredMembers,
    });
  } catch (error) {
    console.error('Dashboard Error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};



