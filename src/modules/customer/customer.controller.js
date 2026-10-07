import {
  createCustomerService,
  getCustomersService,
  getCustomerService,
  updateCustomerService,
  deleteCustomerService,
} from "./customer.service.js";

// CREATE CUSTOMER
export const createCustomer = async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password) {
      return res.status(400).json({
        message: "Name, email, phone and password are required",
      });
    }

    const customer = await createCustomerService(req.body);

    const customerResponse = customer.toObject();
    delete customerResponse.password;

    res.status(201).json({
      message: "Customer created successfully",
      data: customerResponse,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET ALL CUSTOMERS
export const getCustomers = async (req, res) => {
  try {
    const customers = await getCustomersService();

    res.status(200).json({
      data: customers,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET CUSTOMER BY ID
export const getCustomer = async (req, res) => {
  try {
    const customer = await getCustomerService(req.params.id);

    res.status(200).json({
      data: customer,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE CUSTOMER
export const updateCustomer = async (req, res) => {
  try {
    const customer = await updateCustomerService(req.params.id, req.body);

    res.status(200).json({
      message: "Customer updated successfully",
      data: customer,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE CUSTOMER
export const deleteCustomer = async (req, res) => {
  try {
    await deleteCustomerService(req.params.id);

    res.status(200).json({
      message: "Customer deleted successfully",
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};
