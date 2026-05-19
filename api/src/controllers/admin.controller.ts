import { Request, Response } from "express";
import bcrypt from "bcrypt";
import { generateToken } from "../utils/jwt";
import { Admin } from "../schema/admin_schema";

export const loginAdmin = async (req: Request, res: Response) => {
    try {
        const { username, password } = req.body;

        const admin = await Admin.findOne({ username });

        if (!admin) {
            return res.status(400).json({ message: "Admin not found", });
        }

        const isMatch = await bcrypt.compare(password, admin.password);

        if (!isMatch) {
            return res.status(400).json({ message: "Invalid credentials", });
        }

        const token = generateToken(admin._id.toString());

        res.json({ token, });

    } catch (error) {
        res.status(500).json({ message: "Server error", });
    }
};