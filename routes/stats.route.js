const express = require("express")
const {
  getSummary,
  getOverdueCustomers,
} = require("../controllers/stats.controller")
const router = express.Router()

router.get("/summary", getSummary)
router.get("/overdue", getOverdueCustomers)

module.exports = router
