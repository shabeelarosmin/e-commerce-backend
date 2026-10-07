import {
  createAddressService,
  getAddressesService,
  getAddressByIdService,
  updateAddressService,
  deleteAddressService,
} from "./address.service.js";

// CREATE ADDRESS
export const createAddress = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const address = await createAddressService({
      customerId,
      ...req.body,
    });

    res.status(201).json({
      message: "Address created successfully",
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// GET MY ADDRESSES
export const getAddresses = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const addresses = await getAddressesService(customerId);

    res.status(200).json({
      data: addresses,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// GET ADDRESS BY ID
export const getAddressById = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const address = await getAddressByIdService(customerId, req.params.id);

    res.status(200).json({
      data: address,
    });
  } catch (error) {
    res.status(404).json({
      message: error.message,
    });
  }
};

// UPDATE ADDRESS
export const updateAddress = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    const address = await updateAddressService(
      customerId,
      req.params.id,
      req.body,
    );

    res.status(200).json({
      message: "Address updated successfully",
      data: address,
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};

// DELETE ADDRESS
export const deleteAddress = async (req, res) => {
  try {
    const customerId = req.user.customerId;

    if (!customerId) {
      return res.status(400).json({
        message: "Customer account is not linked",
      });
    }

    await deleteAddressService(customerId, req.params.id);

    res.status(200).json({
      message: "Address deleted successfully",
    });
  } catch (error) {
    res.status(400).json({
      message: error.message,
    });
  }
};
