require("dotenv").config()

const express = require("express")
const connectDB = require("./db/connect")
const app = express()

const swaggerUi = require("swagger-ui-express")
const swaggerDocument = require("./swagger-output.json")

// routers
const authRouter = require("./routes/auth.route")
const customerRouter = require("./routes/customer.route")
const loanRouter = require("./routes/loan.route")
const repaymentRouter = require("./routes/repayment.route")
const statsRouter = require("./routes/stats.route")

// middleware
const authMiddleware = require("./middleware/auth.middleware")

app.use(express.json())
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument))

app.get("/", (req, res) => {
  res.send("creditkhaata backend api")
})

app.use("/api/v1/auth", authRouter)
app.use("/api/v1/customers", authMiddleware, customerRouter)
app.use("/api/v1/loans", authMiddleware, loanRouter)
app.use("/api/v1/repayments", authMiddleware, repaymentRouter)
app.use("/api/v1/stats", authMiddleware, statsRouter)

const PORT = process.env.PORT || 10000

const start = async () => {
  try {
    await connectDB(process.env.MONGO_URI)
    app.listen(PORT, () => {
      console.log(`Server is listening on port ${PORT}`)
    })
  } catch (error) {
    console.log(error)
  }
}

start()
