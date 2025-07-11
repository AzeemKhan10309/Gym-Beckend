import Attendance from "../../Models/attendanceModel.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import Member from "../../Models/membersModel.js";
import mongoose from 'mongoose';

export const markAttendance = async (req, res) => {
  const memberId = req.params.memberId;

  try {
    const member = await Member.findById(memberId)
      .populate('trainer_id')
      .populate('membership_plan_id');

    if (!member) {
      return res.status(404).json({ message: 'Member not found' });
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const alreadyMarked = await Attendance.findOne({
      memberId,
      date: { $gte: today, $lt: tomorrow },
    });
     if (member.profileImage && !member.profileImage.startsWith('http')) {
      member.profileImage = `${req.protocol}://${req.get('host')}/${member.profileImage.replace(/\\/g, '/')}`;
    }

    if (alreadyMarked) {
      return res.status(200).json({
        message: 'Attendance already marked today',
        alreadyMarked: true,
        member,
      });
    }

    const newAttendance = new Attendance({
      memberId,
      date: new Date(),
      status: 'present',
      marked_by: req.user?.id || null, 
    });

    await newAttendance.save();

    res.status(201).json({
      message: 'Attendance marked successfully',
      attendance: newAttendance,
      member,
    });
  } catch (error) {
    console.error('❌ Error marking attendance:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
};




   
export const getAllAttendance = async (req, res) => {
    try {
        const attendanceRecords = await Attendance.find();
        res.status(200).json(attendanceRecords);
    } catch (error) {
        console.error("Error fetching attendance records:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};

export const getAttendanceById = async (req, res) => {
  const { id } = req.params;

  try {
    const attendanceRecords = await Attendance.find({ memberId: id })
      .sort({ date: -1 }) 
      .populate('memberId', 'name email');

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found for this member." });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("❌ Error fetching attendance records:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};



export const updateAttendance = async (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    try {
        const updatedAttendance = await Attendence.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!updatedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }

        res.status(200).json({
            message: "Attendance updated successfully",
            attendance: updatedAttendance
        });
    } catch (error) {
        console.error("Error updating attendance:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}
export const deleteAttendance = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedAttendance = await Attendence.findByIdAndDelete(id);
        if (!deletedAttendance) {
            return res.status(404).json({ message: "Attendance record not found" });
        }
        res.status(200).json({ message: "Attendance record deleted successfully" });
    } catch (error) {
        console.error("Error deleting attendance record:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
