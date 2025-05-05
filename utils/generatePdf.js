// Bonus Feature: PDF Receipt Generation for Repayments
const PDFDocument = require("pdfkit")
const fs = require("fs")

exports.generateReceiptPDF = (repayment, loan, customer, callback) => {
  const doc = new PDFDocument()
  const filename = `receipt_${repayment._id}.pdf`
  const filepath = `./receipts/${filename}`

  if (!fs.existsSync("./receipts")) fs.mkdirSync("./receipts")

  doc.pipe(fs.createWriteStream(filepath))

  // Header
  doc
    .fontSize(20)
    .font("Helvetica-Bold")
    .text("CrediKhaata - Repayment Receipt", { align: "center" })
    .moveDown(2)

  // Customer Details
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Customer Details", { underline: true })

  doc
    .font("Helvetica")
    .moveDown(0.5)
    .text(`Name           : ${customer.name}`)
    .text(`Phone          : ${customer.phone}`)
    .text(`Customer ID    : ${customer._id}`)
    .moveDown(1.5)

  // Loan Details
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Loan Details", { underline: true })

  doc
    .font("Helvetica")
    .moveDown(0.5)
    .text(`Loan Description    : ${loan.itemDescription}`)
    .text(`Loan Amount    : Rs. ${loan.loanAmount}`)
    .text(`Due Date       : ${new Date(loan.dueDate).toDateString()}`)
    .text(`Remaining Due  : Rs. ${loan.balance}`)
    .moveDown(1.5)

  // Repayment Details
  doc
    .fontSize(14)
    .font("Helvetica-Bold")
    .text("Repayment Details", { underline: true })

  doc
    .font("Helvetica")
    .moveDown(0.5)
    .text(`Repayment ID   : ${repayment._id}`)
    .text(`Amount Paid    : Rs. ${repayment.amount}`)
    .text(`Payment Date   : ${new Date(repayment.date).toDateString()}`)
    .moveDown(2)

  // Footer
  doc
    .fontSize(12)
    .font("Helvetica-Oblique")
    .text("Thank you for using CreditKhaata!", { align: "center" })

  doc.end()

  doc.on("finish", () => callback(filepath))
}
