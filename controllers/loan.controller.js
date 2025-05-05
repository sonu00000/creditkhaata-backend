const { StatusCodes } = require("http-status-codes")
const Loan = require("../models/Loan")

const createLoan = async (req, res) => {
  const {
    customerId,
    itemDescription,
    loanAmount,
    issueDate,
    dueDate,
    frequency,
    interestPercent,
    graceDays,
  } = req.body

  try {
    const loan = await Loan.create({
      userId: req.user.userId,
      customerId,
      itemDescription,
      loanAmount,
      issueDate,
      dueDate,
      frequency,
      interestPercent,
      graceDays,
      balance: loanAmount,
    })
    return res.status(StatusCodes.CREATED).json({ loan })
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error in creating loan", error: error.message })
  }
}

const getLoans = async (req, res) => {
  const { status } = req.query
  try {
    const query = { userId: req.user.userId }
    if (status) {
      query.status = status
    }
    const loans = await Loan.find(query)
    return res.status(StatusCodes.OK).json(loans)
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Error fetching loans", error: error.message })
  }
}

module.exports = {
  createLoan,
  getLoans,
}
