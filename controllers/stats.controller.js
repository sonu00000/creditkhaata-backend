const { StatusCodes } = require("http-status-codes")
const Loan = require("../models/Loan")
const Repayment = require("../models/Repayment")
const Customer = require("../models/Customer")
const { isBefore, parseISO, differenceInDays } = require("date-fns")
const mongoose = require("mongoose")
const { sendReminder } = require("../utils/smsSMSReminder")

const getSummary = async (req, res) => {
  try {
    // 1. Get all loans for the user
    const loans = await Loan.find({ userId: req.user.userId })
    const totalLoaned = loans.reduce((sum, loan) => sum + loan.loanAmount, 0)

    // 2. Get repayments made against those loans
    const repayments = await Repayment.find({
      loanId: { $in: loans.map((l) => l._id) },
    })

    const totalCollected = repayments.reduce(
      (sum, repayment) => sum + repayment.amount,
      0
    )

    const today = new Date()
    let overdueAmount = 0

    for (const loan of loans) {
      const dueDate = parseISO(loan.dueDate.toISOString())
      const isOverdue = isBefore(dueDate, today) && loan.status !== "paid"
      if (isOverdue) {
        overdueAmount += loan.balance

        // Update status if not already marked overdue
        if (loan.status !== "overdue") {
          loan.status = "overdue"
          await loan.save()
        }
      }
    }

    // Get all fully paid loans for this user
    const paidLoans = await Loan.find({
      userId: req.user.userId,
      status: "paid",
    })

    let totalDays = 0
    let count = 0

    for (const loan of paidLoans) {
      const repayments = await Repayment.find({ loanId: loan._id }).sort({
        date: 1,
      })

      if (repayments.length > 0) {
        const firstDate = new Date(loan.issueDate)
        const lastRepaymentDate = new Date(
          repayments[repayments.length - 1].date
        )

        const diffInMs = lastRepaymentDate - firstDate
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24)

        totalDays += diffInDays
        count++
      }
    }

    const averageRepaymentTime = count > 0 ? (totalDays / count).toFixed(2) : 0

    return res.status(StatusCodes.OK).json({
      totalLoaned,
      totalCollected,
      overdueAmount,
      averageRepaymentTime,
    })
  } catch (error) {
    res.status(500).json({ message: "Summary failed", error: error.message })
  }
}

const getOverdueCustomers = async (req, res) => {
  try {
    const userId = req.user.userId
    console.log(typeof userId)

    // Get all loans created by the logged-in user
    const loans = await Loan.find({ userId })

    const today = new Date()
    const overdueCustomerIds = new Set()

    // Identify loans that are overdue (due date is before today and not fully paid)
    for (const loan of loans) {
      const dueDate = parseISO(loan.dueDate.toISOString())
      const isOverdue = isBefore(dueDate, today) && loan.balance > 0

      if (isOverdue) {
        overdueCustomerIds.add(loan.customerId.toString())

        // Update status if not already marked overdue
        if (loan.status !== "overdue") {
          loan.status = "overdue"
          await loan.save()
        }

        // Fetch customer once per overdue loan
        const customer = await Customer.findOne({
          _id: loan.customerId.toString(),
          userId,
        })
        console.log("customer", customer)

        // Send SMS reminder
        if (customer) {
          sendReminder(customer, loan)
        }
      }
    }

    console.log("Overdue customer ids", overdueCustomerIds)

    // Find customers who have overdue loans
    const overdueCustomers = await Customer.find({
      _id: { $in: Array.from(overdueCustomerIds) }, //converts the set into regular array to do the filtering in mongodb query
      userId: new mongoose.Types.ObjectId(userId), // Ensure customer belongs to the same user
    })

    console.log("overdue customers", overdueCustomers)

    res.status(200).json({
      count: overdueCustomers.length,
      overdueCustomers,
    })
  } catch (error) {
    console.error("Overdue summary error:", error)
    res.status(500).json({ message: "Server error" })
  }
}

module.exports = {
  getSummary,
  getOverdueCustomers,
}
