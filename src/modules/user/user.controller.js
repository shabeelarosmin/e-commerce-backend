import {
  getUsersService,
  getUserService,
  updateUserService,
  deleteUserService,
} from "./user.service.js";

// GET ALL USERS
export const getUsers = async (req, res) => {
  try {
    const users = await getUsersService();

    res.status(200).json({
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET USER BY ID
export const getUser = async (req, res) => {
  try {
    const user = await getUserService(req.params.id);

    res.status(200).json({
      data: user,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE USER
export const updateUser = async (req, res) => {
  try {
    const user = await updateUserService(req.params.id, req.body);

    res.status(200).json({
      message: "User updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE USER
export const deleteUser = async (req, res) => {
  try {
    await deleteUserService(req.params.id);

    res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
