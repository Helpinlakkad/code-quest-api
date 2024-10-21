// backend/controllers/emailController.js
const nodemailer = require('nodemailer');

exports.sendEmail = async (req, res) => {
  const { email, results } = req.body;

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: 'Your Search Results from Code Quest',
    html: `<h1>Your Search Results</h1><pre>${JSON.stringify(results, null, 2)}</pre>`
  };

  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return res.status(500).send(error.toString());
    }
    res.send('Email sent: ' + info.response);
  });
};
