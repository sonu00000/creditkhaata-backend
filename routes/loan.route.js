const express = require("express")
const router = express.Router()
const { createLoan, getLoans } = require("../controllers/loan.controller")

router.route("/").post(createLoan).get(getLoans)

module.exports = router
