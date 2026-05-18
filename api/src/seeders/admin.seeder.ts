import bcrypt from "bcrypt";
import { Admin } from "../schema/admin_schema";

export const seedAdmin = async () => {

    const adminExists = await Admin.findOne({ username: "admin", });

    if (adminExists) return;

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Admin.create({ username: "admin", password: hashedPassword, });
    
    console.log("Default admin created");
};