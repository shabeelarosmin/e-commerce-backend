import {
  registerUser,
  loginUser,
  resetPasswordService,
} from "./auth.service.js";

import Customer from "../customer/customer.model.js";

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

    return res.status(201).json({
      message: "Registration successful",
      ...result,
    });
  } catch (error) {
    return res.status(400).json({
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

    return res.status(200).json({
      message: "Login successful",
      ...result,
    });
  } catch (error) {
    return res.status(401).json({
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

    return res.status(200).json(result);
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

// UPDATE PROFILE
export const updateProfile = async (req, res) => {
  try {
    // customerId should match the Customer document's MongoDB _id.
    const customerId = req.user?.customerId || req.user?.id || req.user?._id;

    if (!customerId) {
      return res.status(401).json({
        message: "Customer authentication details are missing",
      });
    }

    const {
      name,
      email,
      phone,
      dateOfBirth,
      gender,
      address,
      city,
      state,
      pinCode,
    } = req.body;

    const customer = await Customer.findById(customerId);

    if (!customer) {
      return res.status(404).json({
        message: "Customer not found",
      });
    }

    // NAME
    if (name !== undefined) {
      if (typeof name !== "string" || !name.trim()) {
        return res.status(400).json({
          message: "Name cannot be empty",
        });
      }

      customer.name = name.trim();
    }

    // EMAIL
    if (email !== undefined) {
      if (typeof email !== "string" || !email.trim()) {
        return res.status(400).json({
          message: "Email cannot be empty",
        });
      }

      const normalizedEmail = email.trim().toLowerCase();

      const existingCustomer = await Customer.findOne({
        email: normalizedEmail,
        _id: { $ne: customer._id },
      });

      if (existingCustomer) {
        return res.status(409).json({
          message: "This email is already in use",
        });
      }

      customer.email = normalizedEmail;
    }

    // PHONE
    if (phone !== undefined) {
      if (typeof phone !== "string" || !phone.trim()) {
        return res.status(400).json({
          message: "Phone cannot be empty",
        });
      }

      customer.phone = phone.trim();
    }

    // DATE OF BIRTH
    if (dateOfBirth !== undefined) {
      if (dateOfBirth === null || dateOfBirth === "") {
        customer.dateOfBirth = null;
      } else {
        const parsedDate = new Date(dateOfBirth);

        if (Number.isNaN(parsedDate.getTime())) {
          return res.status(400).json({
            message: "Invalid date of birth",
          });
        }

        if (parsedDate > new Date()) {
          return res.status(400).json({
            message: "Date of birth cannot be in the future",
          });
        }

        customer.dateOfBirth = parsedDate;
      }
    }

    // GENDER
    if (gender !== undefined) {
      customer.gender = gender;
    }

    // ADDRESS
    // Customer schema stores address as a string.
    if (address !== undefined) {
      if (typeof address === "string") {
        customer.address = address.trim();
      } else if (address && typeof address === "object") {
        customer.address = String(address.addressLine || "").trim();

        if (address.city !== undefined) {
          customer.city = String(address.city).trim();
        }

        if (address.state !== undefined) {
          customer.state = String(address.state).trim();
        }

        if (address.pinCode !== undefined) {
          customer.pincode = String(address.pinCode).trim();
        }
      } else {
        return res.status(400).json({
          message: "Invalid address format",
        });
      }
    }

    // CITY
    if (city !== undefined) {
      customer.city = String(city).trim();
    }

    // STATE
    if (state !== undefined) {
      customer.state = String(state).trim();
    }

    // PIN CODE
    if (pinCode !== undefined) {
      customer.pincode = String(pinCode).trim();
    }

    await customer.save();

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: customer._id,
        name: customer.name,
        email: customer.email,
        phone: customer.phone,
        dateOfBirth: customer.dateOfBirth,
        gender: customer.gender,
        address: {
          addressLine: customer.address || "",
          city: customer.city || "",
          state: customer.state || "",
          pinCode: customer.pincode || "",
        },
      },
    });
  } catch (error) {
    console.error("Update profile error:", error);

    if (error.code === 11000) {
      return res.status(409).json({
        message: "This email is already in use",
      });
    }

    return res.status(500).json({
      message: "Unable to update profile",
    });
  }
};
