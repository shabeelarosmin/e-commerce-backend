import Address from "./address.model.js";

// CREATE ADDRESS
export const createAddressService = async (data) => {
  const address = await Address.create(data);

  return address;
};

// GET MY ADDRESSES
export const getAddressesService = async (customerId) => {
  const addresses = await Address.find({ customerId });

  return addresses;
};

// GET ADDRESS BY ID
export const getAddressByIdService = async (customerId, addressId) => {
  const address = await Address.findOne({
    _id: addressId,
    customerId,
  });

  if (!address) {
    throw new Error("Address not found or access denied");
  }

  return address;
};

// UPDATE ADDRESS
export const updateAddressService = async (customerId, addressId, data) => {
  const address = await Address.findOneAndUpdate(
    {
      _id: addressId,
      customerId,
    },
    data,
    {
      new: true,
      runValidators: true,
    },
  );

  if (!address) {
    throw new Error("Address not found or access denied");
  }

  return address;
};

// DELETE ADDRESS
export const deleteAddressService = async (customerId, addressId) => {
  const address = await Address.findOneAndDelete({
    _id: addressId,
    customerId,
  });

  if (!address) {
    throw new Error("Address not found or access denied");
  }

  return address;
};
