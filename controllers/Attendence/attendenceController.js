import Attendance from "../../Models/attendanceModel.js";
import { verifyToken } from "../../middleware/authMiddleware.js";
import mongoose from 'mongoose';

export const markAttendance = async (req, res) => {
  const { memberId, date, status } = req.body;
    console.log("Request body:", req.body); // Log incoming data

  if (!memberId || !status) {
    return res.status(400).json({ message: "memberId and status are required" });
  }

  const attendanceDate = date ? new Date(date) : new Date();
  const startOfDay = new Date(attendanceDate.setHours(0, 0, 0, 0));
  const endOfDay = new Date(attendanceDate.setHours(23, 59, 59, 999));

  try {
    const existing = await Attendance.findOne({
      memberId,
      date: { $gte: startOfDay, $lte: endOfDay }
    });

    if (existing) {
      return res.status(409).json({ message: "Attendance already marked for today." });
    }

    const marked_by = req.user.id; 

    const newAttendance = new Attendance({
      memberId,
      marked_by,
      date: attendanceDate,
      status
    });

    await newAttendance.save();

    res.status(201).json({
      message: "Attendance marked successfully",
      attendance: {
        id: newAttendance._id,
        memberId: newAttendance.memberId,
        marked_by: newAttendance.marked_by,
        date: newAttendance.date,
        status: newAttendance.status,
      }
    });

  } catch (error) {
    console.error("Error marking attendance:", error);
    res.status(500).json({ message: "Internal server error" });
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
      .sort({ date: -1 }) // newest first
      .populate('memberId', 'name email');

    if (attendanceRecords.length === 0) {
      return res.status(404).json({ message: "No attendance records found for this member." });
    }

    res.status(200).json(attendanceRecords);
  } catch (error) {
    console.error("Error fetching attendance records:", error);
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
