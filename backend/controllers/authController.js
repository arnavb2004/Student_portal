const nodemailer = require('nodemailer');

// Temporary storage for OTPs (Replace with Database in production)
const otpStore = {};

// Configure Nodemailer Transporter (Use your credentials)
const transporter = nodemailer.createTransport({
  service: 'gmail', 
  auth: {
    user: process.env.EMAIL_USER, // Your email
    pass: process.env.EMAIL_PASS, // Your email password or app password
  },
});

// Function to generate a 6-digit OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// 📌 **Send OTP to Email**
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ success: false, message: 'Email is required' });
  }

  try {
    const otp = generateOtp();
    const expiry = Date.now() + 5 * 60 * 1000; // OTP expires in 5 minutes
    otpStore[email] = { otp, expiry };

    // Send OTP via Email
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'Your OTP for Login',
      text: `Your OTP is: ${otp}. It is valid for 5 minutes.`,
    });

    res.json({ success: true, message: `OTP sent to ${email}` });
  } catch (error) {
    console.error('Error sending OTP:', error);
    res.status(500).json({ success: false, message: 'Error sending OTP' });
  }
};

// 📌 **Verify OTP**
exports.verifyOtp = (req, res) => {
  const { email, otp } = req.body;
  if (!email || !otp) {
    return res.status(400).json({ success: false, message: 'Email and OTP are required' });
  }

  const storedOtpData = otpStore[email];
  if (!storedOtpData) {
    return res.status(400).json({ success: false, message: 'No OTP found for this email' });
  }

  const { otp: storedOtp, expiry } = storedOtpData;
  if (Date.now() > expiry) {
    delete otpStore[email]; // Remove expired OTP
    return res.status(400).json({ success: false, message: 'OTP has expired' });
  }

  if (storedOtp === otp) {
    delete otpStore[email]; // Remove OTP after successful verification
    res.json({ success: true, message: 'OTP verified successfully' });
  } else {
    res.status(400).json({ success: false, message: 'Invalid OTP' });
  }
};
