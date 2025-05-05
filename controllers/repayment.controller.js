const { StatusCodes } = require("http-status-codes")
const Loan = require("../models/Loan")
const Repayment = require("../models/Repayment")
const Customer = require("../models/Customer")
const { generateReceiptPDF } = require("../utils/generatePdf")

const recordRepayment = async (req, res) => {
  const { loanId, amount, date } = req.body

  try {
    const loan = await Loan.findById(loanId)
    if (!loan || String(loan.userId) !== req.user.userId) {
      return res
        .status(StatusCodes.NOT_FOUND)
        .json({ message: "Loan not found" })
    }

    if (loan.balance <= 0) {
      return res.status(StatusCodes.OK).json({ message: "Loan already paid." })
    }

    if (amount > loan.balance) {
      return res.status(StatusCodes.BAD_REQUEST).json({
        message: `Amount is greater than Loan balance which is ${loan.balance}. Enter amount less than or equal to loan balance`,
      })
    }

    const repayment = await Repayment.create({ loanId, amount, date })

    loan.balance -= amount
    if (loan.balance <= 0) {
      loan.status = "paid"
      loan.balance = 0
    }
    await loan.save()

    console.log(loan.customerId)
    const customerId = loan.customerId.toString()
    console.log("customerid", customerId)
    const customer = await Customer.findOne({ _id: customerId })
    console.log(customer)

    generateReceiptPDF(repayment, loan, customer, (filePath) => {
      res.status(201).json({ repayment, updatedLoan: loan, receipt: filePath })
    })

    return res
      .status(StatusCodes.CREATED)
      .json({ repayment, updatedLoan: loan })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in loan repayment", error: error.message })
  }
}

const getAllRepayments = async (req, res) => {
  try {
    // Step 1: Find all loan IDs that belong to this user
    const userLoans = await Loan.find({ userId: req.user.userId })
    const loanIds = userLoans.map((loan) => loan._id)
    console.log(loanIds)

    // Step 2: Find repayments where loanId is in the list of user's loans
    const repayments = await Repayment.find({ loanId: { $in: loanIds } })

    return res.status(StatusCodes.OK).json({ repayments })
  } catch (error) {
    res.status(500).json({
      message: "Error in fetching loan repayments",
      error: err.message,
    })
  }
}

module.exports = {
  recordRepayment,
  getAllRepayments,
}
