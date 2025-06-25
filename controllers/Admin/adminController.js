import Admin from "../../Models/adminModel.js";
import Trainer from "../../Models/trainerModel.js"
import User from "../../Models/membersModel.js"
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

export const registerAdmin = async (req, res) => {
    const { name, email, password } = req.body;

    try {
        const existingAdmin = await Admin.findOne({ email });
        if (existingAdmin) {
            return res.status(400).json({ message: "Admin already exists" });
        }
        const hashedPassword = await bcrypt.hash(password, 10);
        const newAdmin = new Admin({
            name,
            email,
            password: hashedPassword
        }); 
        await newAdmin.save();
        res.status(201).json({
            message: "Admin registered successfully",
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email
            },
            
        });
    } catch (error) {
        console.error("Error registering admin:", error);
        res.status(500).json({ message: "Internal server error" });
    }
}

export const loginAdmin = async (req, res) => {
  const { email, password } = req.body;

  try {
    let person = await Admin.findOne({ email });
    let role = "admin";

    if (!person) {
      person = await Trainer.findOne({ email });
      role = "trainer";
    }

    if (!person) {
      person = await User.findOne({ email });
      role = "user";
    }

    if (!person) {
      return res.status(404).json({ message: "Account not found" });
    }

    const isPasswordValid = await bcrypt.compare(password, person.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid password" });
    }

    // ✅ Include name and role in token
    const token = jwt.sign(
      { id: person._id, name: person.name, role },
      process.env.JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.status(200).json({
      message: `${role.charAt(0).toUpperCase() + role.slice(1)} logged in successfully`,
      user: {
        id: person._id,
        name: person.name,
        email: person.email,
        role,
      },
      token,
    });

  } catch (error) {
    console.error("Error logging in admin:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

