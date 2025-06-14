import Membership from "../../Models/membershipPlanModel.js";
import mongoose from 'mongoose';

export const registerMembership = async (req, res) => {
    const { plan_name, duration_in_days, price, description } = req.body;
      if (!plan_name || !duration_in_days || !price) {
        return res.status(400).json({ message: "Missing required fields" });
    }
    try {
        const existingMembership = await Membership.findOne({plan_name });
        if (existingMembership) {
            return res.status(400).json({ message: "Membership plan already exists for this member" });
        }

        const newMembership = new Membership({
           plan_name,
           duration_in_days,
            price,
            description
        });

        await newMembership.save();
        res.status(201).json({
         message: "Membership registered successfully",
         membership: {
         id: newMembership._id,
         plan_name: newMembership.plan_name,
         duration_in_days: newMembership.duration_in_days,
        price: newMembership.price,
         description: newMembership.description
  }
});
    } catch (error) {
        console.error("Error registering membership:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getAllMemberships = async (req, res) => {
    try {
        const memberships = await Membership.find();
        res.status(200).json({plans:memberships});
    } catch (error) {
        console.error("Error fetching memberships:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const getMembershipById = async (req, res) => {
    const { id } = req.params;

    try {
        const membership = await Membership.findById(id);
        if (!membership) {
            return res.status(404).json({ message: "Membership not found" });
        }
        res.status(200).json(membership);
    } catch (error) {
        console.error("Error fetching membership:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const updateMembership = async (req, res) => {
    const { id } = req.params;
    const { plan_name, duration_in_days, price, description } = req.body;

    try {
        const updatedMembership = await Membership.findByIdAndUpdate(
            id,
            { plan_name, duration_in_days, price, description },
            { new: true }
        );
        if (!updatedMembership) {
            return res.status(404).json({ message: "Membership not found" });
        }
        res.status(200).json({
            message: "Membership updated successfully",
            updatedPlan: updatedMembership
        });
    } catch (error) {
        console.error("Error updating membership:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};
export const deleteMembership = async (req, res) => {
    const { id } = req.params;

    try {
        const deletedMembership = await Membership.findByIdAndDelete(id);
        if (!deletedMembership) {
            return res.status(404).json({ message: "Membership not found" });
        }
        res.status(200).json({ message: "Membership deleted successfully" });
    } catch (error) {
        console.error("Error deleting membership:", error);
        res.status(500).json({ message: "Internal server error" });
    }
};