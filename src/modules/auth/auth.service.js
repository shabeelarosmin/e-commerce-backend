import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Auth from "./auth.model.js";
import Customer from "../customer/customer.model.js";

// GENERATE JWT TOKEN
const generateToken = (user) => {
  if (!process.env.JWT_SECRET) {
    throw new Error("JWT_SECRET is not configured");
  }

  return jwt.sign(
    {
      id: user._id.toString(),
      ...(user.customerId ? { customerId: user.customerId.toString() } : {}),
      email: user.email,
      role: String(user.role || "customer").toLowerCase(),
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// FORMAT USER RESPONSE
const formatUser = (user) => ({
  id: user._id,
  customerId: user.customerId || null,
  name: user.name,
  email: user.email,
  role: String(user.role || "customer").toLowerCase(),
});

// REGISTER
export const registerUser = async (data) => {
  const { name, email, password, phone } = data;

  if (!name || !email || !password) {
    throw new Error("Name, email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  // CHECK EXISTING AUTH USER
  const existingUser = await Auth.findOne({
    email: normalizedEmail,
  });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // CHECK EXISTING CUSTOMER
  const existingCustomer = await Customer.findOne({
    email: normalizedEmail,
  });

  if (existingCustomer) {
    throw new Error("Customer email already exists");
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  // CREATE CUSTOMER
  const customer = await Customer.create({
    name: name.trim(),
    email: normalizedEmail,
    password: hashedPassword,
    phone,
    active: true,
  });

  try {
    // CREATE AUTH USER
    // Public registration must always create a customer.
    const user = await Auth.create({
      name: name.trim(),
      email: normalizedEmail,
      password: hashedPassword,
      role: "customer",
      customerId: customer._id,
      active: true,
    });

    const token = generateToken(user);

    return {
      user: formatUser(user),
      token,
    };
  } catch (error) {
    // Avoid leaving an orphan customer if Auth creation fails.
    await Customer.findByIdAndDelete(customer._id);
    throw error;
  }
};

// LOGIN
export const loginUser = async (email, password) => {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const user = await Auth.findOne({
    email: normalizedEmail,
  });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // CHECK PASSWORD
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // CHECK ACTIVE
  if (user.active === false) {
    throw new Error("User account is inactive");
  }

  // DEBUG: CHECK THE ROLE IN THE BACKEND TERMINAL
  console.log("Login successful:", user.email);
  console.log("Login role:", user.role);

  const token = generateToken(user);

  return {
    user: formatUser(user),
    token,
  };
};

// RESET PASSWORD
export const resetPasswordService = async (email, newPassword) => {
  if (!email || !newPassword) {
    throw new Error("Email and new password are required");
  }

  const normalizedEmail = email.trim().toLowerCase();

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  // CHECK AUTH USER
  let user = await Auth.findOne({
    email: normalizedEmail,
  });

  if (user) {
    user.password = hashedPassword;
    await user.save();

    if (user.customerId) {
      await Customer.findByIdAndUpdate(
        user.customerId,
        { password: hashedPassword },
        { runValidators: true },
      );
    }

    return {
      message: "Password reset successfully",
    };
  }

  // CHECK EXISTING CUSTOMER
  const customer = await Customer.findOne({
    email: normalizedEmail,
  });

  if (!customer) {
    throw new Error("User not found");
  }

  // CREATE CUSTOMER AUTH ACCOUNT
  user = await Auth.create({
    name: customer.name,
    email: normalizedEmail,
    password: hashedPassword,
    role: "customer",
    customerId: customer._id,
    active: true,
  });

  // UPDATE CUSTOMER PASSWORD
  customer.password = hashedPassword;
  await customer.save();

  return {
    message: "Password reset successfully",
  };
};
