import bcrypt from "bcryptjs";

import Customer from "./customer.model.js";
import Auth from "../auth/auth.model.js";

// CREATE CUSTOMER
export const createCustomerService = async (data) => {
  const { name, email, phone, password, address, city, state, pincode } = data;

  const existingCustomer = await Customer.findOne({ email });

  if (existingCustomer) {
    throw new Error("Customer already exists");
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const customer = await Customer.create({
    name,
    email,
    phone,
    password: hashedPassword,
    address,
    city,
    state,
    pincode,
  });

  return customer;
};

// GET ALL CUSTOMERS
export const getCustomersService = async () => {
  return await Customer.find().select("-password");
};

// GET CUSTOMER BY ID
export const getCustomerService = async (id) => {
  const customer = await Customer.findById(id).select("-password");

  if (!customer) {
    throw new Error("Customer not found");
  }

  return customer;
};

// UPDATE CUSTOMER
export const updateCustomerService = async (id, data) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // CHECK EMAIL DUPLICATE
  if (data.email && data.email !== customer.email) {
    const existingCustomer = await Customer.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (existingCustomer) {
      throw new Error("Email already exists");
    }
  }

  // HASH PASSWORD
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  const updatedCustomer = await Customer.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");

  return updatedCustomer;
};

// DELETE CUSTOMER
export const deleteCustomerService = async (id) => {
  const customer = await Customer.findById(id);

  if (!customer) {
    throw new Error("Customer not found");
  }

  // DELETE CUSTOMER
  await Customer.findByIdAndDelete(id);

  // DELETE AUTH USER
  await Auth.findOneAndDelete({
    customerId: id,
    role: "customer",
  });

  return customer;
};
