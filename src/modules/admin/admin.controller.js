import {
  createAdminService,
  getAdminsService,
  getAdminService,
  updateAdminService,
  deleteAdminService,
} from "./admin.service.js";

// CREATE ADMIN
export const createAdmin = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        message: "Name, email and password are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const admin = await createAdminService(req.body);

    res.status(201).json({
      message: "Admin created successfully",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL ADMINS
export const getAdmins = async (req, res) => {
  try {
    const admins = await getAdminsService();

    res.status(200).json({
      data: admins,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET ADMIN BY ID
export const getAdmin = async (req, res) => {
  try {
    const admin = await getAdminService(req.params.id);

    res.status(200).json({
      data: admin,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE ADMIN
export const updateAdmin = async (req, res) => {
  try {
    const admin = await updateAdminService(req.params.id, req.body);

    res.status(200).json({
      message: "Admin updated successfully",
      data: admin,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE ADMIN
export const deleteAdmin = async (req, res) => {
  try {
    await deleteAdminService(req.params.id);

    res.status(200).json({
      message: "Admin deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
