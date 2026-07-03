const User = require("../model/user");
const bcrypt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const sendEmail = require("../utils/sendEmail");
const { json } = require("express");



const genrateToken = (id) => {
    return jwt.sign({id}, process.env.JWT_SECRET, {expiresIn: "1d"})
}


const registerUser = async (req, res) => {
    const {name, password, email} = req.body;

    try {

        const existingUser = await User.findOne({email})

        if (existingUser) {
            return res.status(400).json({message: "user already exists"})
        }
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const newUser = await User.create({name, email, password: hashedPassword})

        if (newUser) {

            const otp = Math.floor(100000 + Math.random() * 900000).toString()
            const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 min expiry

            const message = `wellcome to shoppy , ${name} your otp for shoppy reistration is ${otp}`

            await sendEmail(email, "Wellcome to shoppy - your otp for registration", message)

            res.status(201).json({
               _id: newUser._id,
               name: newUser.name,
               email:newUser.email,
               role: newUser.role,
               token: genrateToken(newUser._id) 
            })
            
        }
        else {
            res.status(400).json({
                message: "invalid user data"
            })
        }
    } catch (error) {
        res.status(500)
        .json({ message: "sever error"})
    }
}

const loginUser = async(req, res) => {
    const {email, password} = req.body
    try {
        const user = await User.findOne({email})
        if (user && (await bcrypt.compare(password, user.password))) {
           res.json({
            _id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            token: genrateToken(user._id)
           }) 
        }else {
            res.status(400).json({message: "invalid email or password"})
        }
    } catch {
        res.status(500).json({message: "sever error"})
    }
}

const getUsers = async(req, res) => {
    try {
        const users = await User.find({}).select('-password')
        res.json(users)
    } catch (error) {
        res.status(500).json({message: "sever error"})
    }
}

// Verify OTP
const verifyOtp = async (req, res) => {
  const { email, otp } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    if (user.otpExpires < new Date()) {
      return res.status(400).json({ message: "OTP has expired" });
    }

    // Clear OTP after successful verification
    user.otp = null;
    user.otpExpires = null;
    user.isVerified = true;
    await user.save();

    res.json({ message: "OTP verified successfully" });

  } catch (error) {
    console.error("OTP verify error:", error);
    res.status(500).json({ message: "Server error" });
  }
};


module.exports = {
    registerUser,
    loginUser,
    getUsers,
    verifyOtp
}

