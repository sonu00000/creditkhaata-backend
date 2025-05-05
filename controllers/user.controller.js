const User = require("../models/User")
const { StatusCodes } = require("http-status-codes")
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")

const register = async (req, res) => {
  const { email, password } = req.body

  try {
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide email and password" })
    }

    const exists = await User.findOne({ email })
    if (exists) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Email already exists" })
    }

    const hashedPassword = await bcrypt.hash(password, 10)
    const user = await User.create({ email, password: hashedPassword })

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    })
    res.status(StatusCodes.CREATED).json({ token })
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error in registration", error: error.message })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    if (!email || !password) {
      return res
        .status(StatusCodes.BAD_REQUEST)
        .json({ message: "Please provide email and password" })
    }
    const user = await User.findOne({ email })
    if (!user) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: `Incorrect credentials` })
    }

    const match = await bcrypt.compare(password, user.password)
    if (!match) {
      return res
        .status(StatusCodes.UNAUTHORIZED)
        .json({ message: `Incorrect credentials` })
    }

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_LIFETIME,
    })
    res.status(StatusCodes.CREATED).json({ token })
  } catch (error) {
    res.status(500).json({ message: "Login failure", error: error.message })
  }
}

module.exports = {
  register,
  login,
}
