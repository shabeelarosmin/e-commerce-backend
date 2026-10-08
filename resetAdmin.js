import dotenv from "dotenv";
import bcrypt from "bcryptjs";
import dbConnect from "./db.js";
import Auth from "./src/modules/auth/auth.model.js";

dotenv.config();

const resetAdmin = async () => {
  try {
    await dbConnect();

    const hashedPassword = await bcrypt.hash("admin123", 10);

    const admin = await Auth.findOneAndUpdate(
      { email: "admin@gmail.com", role: "admin" },
      {
        password: hashedPassword,
        active: true,
      },
      { new: true },
    );

    if (!admin) {
      console.log("Admin not found");
      process.exit(1);
    }

    console.log("Admin password reset successfully");
    process.exit(0);
  } catch (error) {
    console.error(error);
    process.exit(1);
  }
};

resetAdmin();
