import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

import Auth from "./auth.model.js";
import Customer from "../customer/customer.model.js";

// GENERATE JWT TOKEN
const generateToken = (user) => {
  return jwt.sign(
    {
      id: user._id,
      customerId: user.customerId,
      email: user.email,
      role: user.role,
    },
    process.env.JWT_SECRET,
    {
      expiresIn: "7d",
    },
  );
};

// REGISTER
export const registerUser = async (data) => {
  const { name, email, password, phone } = data;

  // CHECK AUTH USER
  const existingUser = await Auth.findOne({ email });

  if (existingUser) {
    throw new Error("Email already exists");
  }

  // CHECK CUSTOMER
  const existingCustomer = await Customer.findOne({
    email,
  });

  if (existingCustomer) {
    throw new Error("Customer email already exists");
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  // CREATE CUSTOMER
  const customer = await Customer.create({
    name,
    email,
    password: hashedPassword,
    phone,
    active: true,
  });

  // CREATE AUTH USER
  const user = await Auth.create({
    name,
    email,
    password: hashedPassword,
    role: "customer",
    customerId: customer._id,
    active: true,
  });

  // GENERATE JWT
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      customerId: user.customerId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

// LOGIN
export const loginUser = async (email, password) => {
  const user = await Auth.findOne({ email });

  if (!user) {
    throw new Error("Invalid email or password");
  }

  // CHECK PASSWORD
  const isPasswordValid = await bcrypt.compare(password, user.password);

  if (!isPasswordValid) {
    throw new Error("Invalid email or password");
  }

  // CHECK ACTIVE
  if (!user.active) {
    throw new Error("User account is inactive");
  }

  // GENERATE JWT
  const token = generateToken(user);

  return {
    user: {
      id: user._id,
      customerId: user.customerId,
      name: user.name,
      email: user.email,
      role: user.role,
    },
    token,
  };
};

export const resetPasswordService = async (
  email,
  newPassword
) => {
  let user = await Auth.findOne({ email });

  const hashedPassword = await bcrypt.hash(
    newPassword,
    10
  );

  // AUTH USER EXISTS
  if (user) {
    user.password = hashedPassword;

    await user.save();

    if (user.customerId) {
      await Customer.findByIdAndUpdate(
        user.customerId,
        {
          password: hashedPassword,
        },
        {
          runValidators: true,
        }
      );
    }

    return {
      message: "Password reset successfully",
    };
  }

  // AUTH USER NOT FOUND
  // CHECK CUSTOMER
  const customer = await Customer.findOne({ email });

  if (!customer) {
    throw new Error("User not found");
  }

  // CREATE AUTH ACCOUNT FOR EXISTING CUSTOMER
  user = await Auth.create({
    name: customer.name,
    email: customer.email,
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