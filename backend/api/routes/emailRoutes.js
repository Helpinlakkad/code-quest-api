// backend/routes/emailRoutes.js
const express = require('express');
const router = express.Router();
const emailController = require('../controllers/emailController');

// Define the route for sending emails
router.post('/', emailController.sendEmail);

module.exports = router;
