require("dotenv").config()
const twilio = require("twilio")

const client = twilio(
  process.env.TWILIO_ACCOUNT_SID,
  process.env.TWILIO_AUTH_TOKEN
)

exports.sendReminder = (customer, loan) => {
  const message = `
OVERDUE LOAN REMINDER

Dear ${customer.name},

Your loan of Rs.${loan.loanAmount} was due on ${new Date(
    loan.dueDate
  ).toDateString()} and is now overdue.

Pending Balance: Rs.${loan.balance}

Please pay soon to avoid penalties.

- CreditKhaata
`.trim()

  client.messages
    .create({
      body: message,
      from: process.env.TWILIO_PHONE_NUMBER,
      // to: customer.phone.startsWith("+")
      //   ? customer.phone
      //   : `+91${customer.phone}`, // default India code
      to: process.env.TO_PHONE_NUMBER,
    })
    .then((message) => {
      console.log(`📩 SMS sent to ${customer.phone} | SID: ${message.sid}`)
    })
    .catch((error) => {
      console.error(`❌ SMS failed for ${customer.phone}:`, error.message)
    })
}
