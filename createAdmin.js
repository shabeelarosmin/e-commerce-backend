import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import dbConnect from "./db.js";
import Auth from "./src/modules/auth/auth.model.js";

dotenv.config();

const createAdmin = async () => {
  try {
    await dbConnect();

    const existingAdmin = await Auth.findOne({
      email: "admin@gmail.com",
    });

    if (existingAdmin) {
      console.log("Admin already exists");
      process.exit(0);
    }

    const hashedPassword = await bcrypt.hash("admin123", 10);

    await Auth.create({
      name: "Admin",
      email: "admin@gmail.com",
      password: hashedPassword,
      role: "admin",
      active: true,
    });

    console.log("Admin created successfully");

    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

createAdmin();
