import {
  registerUser,
  loginUser,
  resetPasswordService,
} from "./auth.service.js";

// REGISTER
export const register = async (req, res) => {
  try {
    const { name, email, password, phone } = req.body;

    if (!name || !email || !password || !phone) {
      return res.status(400).json({
        message: "Name, email, password and phone are required",
      });
    }

    const result = await registerUser({
      name,
      email,
      password,
      phone,
    });

    res.status(201).json({
      message: "Registration successful",
      ...result,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// LOGIN
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        message: "Email and password are required",
      });
    }

    const result = await loginUser(email, password);

    res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    res.status(401).json({
      message: error.message,
    });
  }
};

// RESET PASSWORD
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;

    if (!email || !newPassword) {
      return res.status(400).json({
        message: "Email and new password are required",
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    const result = await resetPasswordService(email, newPassword);

    res.status(200).json(result);
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
