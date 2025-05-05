const mongoose = require("mongoose")

const loanSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    customerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Customer",
      required: true,
    },
    itemDescription: {
      type: String,
    },
    loanAmount: {
      type: Number,
      required: true,
    },
    issueDate: {
      type: Date,
      required: true,
    },
    dueDate: {
      type: Date,
      required: true,
    },
    frequency: {
      type: String,
      enum: ["bi-weekly", "monthly"],
      required: [true, "Please provide frequency"],
    },
    interestPercent: {
      type: Number,
      default: 0,
    },
    graceDays: {
      type: Number,
      default: 0,
    },
    status: {
      type: String,
      enum: ["pending", "paid", "overdue"],
      default: "pending",
    },
    balance: {
      type: Number,
      required: true,
    },
  },
  { timestamps: true }
)

module.exports = mongoose.model("Loan", loanSchema)
