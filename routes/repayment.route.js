const express = require("express")
const router = express.Router()
const {
  recordRepayment,
  getAllRepayments,
} = require("../controllers/repayment.controller")

router.post("/", recordRepayment)
router.get("/", getAllRepayments)

module.exports = router
