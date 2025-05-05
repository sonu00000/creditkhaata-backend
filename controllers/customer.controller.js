const { StatusCodes } = require("http-status-codes")
const Customer = require("../models/Customer")

const createCustomer = async (req, res) => {
  const { name, phone, address, trustScore, creditLimit } = req.body
  try {
    const customer = await Customer.create({
      userId: req.user.userId,
      name,
      phone,
      address,
      trustScore,
      creditLimit,
    })
    return res.status(StatusCodes.CREATED).json({ customer })
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in creating Customer", error: error.message })
  }
}

const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ userId: req.user.userId })
    return res.status(StatusCodes.OK).json({ customers })
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in fetching customers", error: error.message })
  }
}

const updateCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndUpdate(
      {
        _id: req.params.id,
        userId: req.user.userId,
      },
      req.body,
      { new: true }
    )

    if (!customer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Customer not found" })
    }
    return res.status(StatusCodes.OK).json({ customer })
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in updating customer", error: error.message })
  }
}

const deleteCustomer = async (req, res) => {
  try {
    const customer = await Customer.findOneAndDelete({
      _id: req.params.id,
      userId: req.user.userId,
    })
    if (!customer) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Customer not found" })
    }
    return res.status(StatusCodes.OK).json({ message: "Customer deleted" })
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in deleting customer", error: error.message })
  }
}

module.exports = {
  createCustomer,
  getCustomers,
  updateCustomer,
  deleteCustomer,
}
