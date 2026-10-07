import Auth from "../auth/auth.model.js";

// GET ALL USERS
export const getUsersService = async () => {
  return await Auth.find().select("-password").sort({ createdAt: -1 });
};

// GET USER BY ID
export const getUserService = async (id) => {
  const user = await Auth.findById(id).select("-password");

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// UPDATE USER
export const updateUserService = async (id, data) => {
  const user = await Auth.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  if (data.email && data.email !== user.email) {
    const existingUser = await Auth.findOne({
      email: data.email,
      _id: { $ne: id },
    });

    if (existingUser) {
      throw new Error("Email already exists");
    }
  }

  // Role should not be changed through this API
  if (data.role) {
    delete data.role;
  }

  // Password update is handled separately
  if (data.password) {
    throw new Error("Use reset password API to change password");
  }

  return await Auth.findByIdAndUpdate(id, data, {
    new: true,
    runValidators: true,
  }).select("-password");
};

// DELETE USER
export const deleteUserService = async (id) => {
  const user = await Auth.findById(id);

  if (!user) {
    throw new Error("User not found");
  }

  await Auth.findByIdAndDelete(id);

  return user;
};
