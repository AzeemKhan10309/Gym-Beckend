import Member from "../../Models/membersModel.js";
import bcrypt from "bcryptjs";
import { sendWelcomeEmail } from "../../utils/sendMail.js";
export const registerMember = async (req, res) => {
    const { name, email, phone, password,date_of_birth,membership_start_date,membership_end_date,membership_plan_id,trainer_id } = req.body;
      const generateNumericCode = (length = 6) => {
    const min = Math.pow(10, length - 1);
    const max = Math.pow(10, length) - 1; 
    return Math.floor(Math.random() * (max - min + 1)) + min;
  };
  let special_code;
    let isDuplicate = true;

    while (isDuplicate) {
      special_code = generateNumericCode(); // Call local function
      const existing = await Member.findOne({ special_code });
      if (!existing) isDuplicate = false;
    }
    try {
        const existingMember = await Member.findOne({ email });
        if (existingMember) {
            return res.status(400).json({ message: "Member already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
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
            special_code
        }); 
        await newMember.save();
        await sendWelcomeEmail(email, name, special_code);

        res.status(201).json({
            message: "Member registered successfully",
            member: {
                id: newMember._id,
                name: newMember.name,
                email: newMember.email,
                phone: newMember.phone
            }
        });
    }   
    catch (error) {
        console.error("Error registering member:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
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
        const members = await Member.find().populate('trainer_id', 'name')
  .populate('membership_plan_id', 'plan_name');
        res.status(200).json({users:members});
    } catch (error) {
        console.error("Error fetching members:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
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
    const { name, email, phone, password,date_of_birth,membership_start_date,membership_end_date,membership_plan_id,trainer_id } = req.body;

    try {
        const updatedMember = await Member.findByIdAndUpdate(id, { name, email, phone, password,date_of_birth,membership_start_date,membership_end_date,membership_plan_id,trainer_id }, { new: true });
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
        res.status(200).json({ message: "Member deleted successfully" });
    } catch (error) {
        console.error("Error deleting member:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const autoSearch =async (req,res)=>{
    try {
    const query = req.query.q;
    if (!query) return res.json([]);
    
    const results = await Member.find({
      $or: [
        { name: { $regex: query, $options: 'i' } },
        { special_code: { $regex: query, $options: 'i' } }
      ] 
    }).select('name special_code isFeePaid').limit(10); // limit for suggestions

    res.json(results);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};
// controllers/memberController.js

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
    const member = await Member.findById(id).populate("membership_plan_id", "planName").populate("trainer_id", "name").populate("assignedDietPlan","planName diet").populate("assignedWorkoutPlan", "title days")


    if (!member) {
      return res.status(404).json({ message: "Member not found" });
    }
    res.status(200).json(member);
  } catch (error) {
    console.error("Error fetching member:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};




