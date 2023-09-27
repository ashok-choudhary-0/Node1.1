const nodemailer = require("nodemailer")
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.nodemailerEmail,
    pass: process.env.nodemailerEmailPassword
  }
})
module.exports = { transporter }