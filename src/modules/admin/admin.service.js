import bcrypt from "bcryptjs";

import Admin from "./admin.model.js";
import Auth from "../auth/auth.model.js";

// CREATE ADMIN
export const createAdminService = async (data) => {
  const { name, email, password } = data;

  // CHECK ADMIN
  const existingAdmin = await Admin.findOne({ email });

  if (existingAdmin) {
    throw new Error("Admin already exists");
  }

  // CHECK AUTH USER
  const existingAuth = await Auth.findOne({ email });

  if (existingAuth) {
    throw new Error("Email already exists");
  }

  // HASH PASSWORD
  const hashedPassword = await bcrypt.hash(password, 10);

  // CREATE ADMIN
  const admin = await Admin.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    active: true,
  });

  // CREATE AUTH ACCOUNT
  await Auth.create({
    name,
    email,
    password: hashedPassword,
    role: "admin",
    customerId: null,
    active: true,
  });

  // REMOVE PASSWORD FROM RESPONSE
  const adminResponse = admin.toObject();
  delete adminResponse.password;

  return adminResponse;
};

// GET ALL ADMINS
export const getAdminsService = async () => {
  return await Admin.find().select("-password").sort({
    createdAt: -1,
  });
};

// GET ADMIN BY ID
export const getAdminService = async (id) => {
  const admin = await Admin.findById(id).select("-password");

  if (!admin) {
    throw new Error("Admin not found");
  }

  return admin;
};

// UPDATE ADMIN
export const updateAdminService = async (id, data) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new Error("Admin not found");
  }

  const oldEmail = admin.email;

  // CHECK EMAIL DUPLICATE
  if (data.email && data.email !== oldEmail) {
    const existingAdmin = await Admin.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (existingAdmin) {
      throw new Error("Email already exists");
    }

    const existingAuth = await Auth.findOne({
      email: data.email,
    });

    if (existingAuth) {
      throw new Error("Email already exists");
    }
  }

  // HASH PASSWORD
  if (data.password) {
    data.password = await bcrypt.hash(data.password, 10);
  }

  // DON'T ALLOW ROLE CHANGE
  if (data.role) {
    delete data.role;
  }

  const updatedAdmin = await Admin.findByIdAndUpdate(
    id,
    data,
    {
      new: true,
      runValidators: true,
    }
  ).select("-password");

  // UPDATE AUTH ACCOUNT
  const authUpdate = {};

  if (data.name) {
    authUpdate.name = data.name;
  }

  if (data.email) {
    authUpdate.email = data.email;
  }

  if (data.password) {
    authUpdate.password = data.password;
  }

  if (data.active !== undefined) {
    authUpdate.active = data.active;
  }

  if (Object.keys(authUpdate).length > 0) {
    await Auth.findOneAndUpdate(
      {
        email: oldEmail,
        role: "admin",
      },
      authUpdate,
      {
        runValidators: true,
      }
    );
  }

  return updatedAdmin;
};

// DELETE ADMIN
export const deleteAdminService = async (id) => {
  const admin = await Admin.findById(id);

  if (!admin) {
    throw new Error("Admin not found");
  }

  // DELETE ADMIN
  await Admin.findByIdAndDelete(id);

  // DELETE AUTH ACCOUNT
  await Auth.findOneAndDelete({
    email: admin.email,
    role: "admin",
  });

  return admin;
};
