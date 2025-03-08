const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const TeamPartner = require("../models/company_partner");
const {sendMail} = require("../utils/sendMail");
const { ObjectId } = require("mongoose").Types;
const redis = require("../config/redis"); // Import your Redis setup
const path = require("path");

const jwt = require('jsonwebtoken');

const generateToken = require("../utils/generate_tokens");

const company_Partner_Signup = async (req, res) => {
      try {
        const { email, password } = req.body;
    
        if (!email || !password) {
          return res.status(400).json({ message: "Email and Password are required" });
        }
    
        let existingUser = await TeamPartner.findOne({ email });
    
        if (existingUser) {
          if (existingUser.email_verified) {
            return res.status(409).json({
              message: "This email is already registered and verified. Please login.",
            });
          }
    
          const otpIssuedTime = new Date(existingUser.updatedAt).getTime();
          const otpExpiryTime = 10 * 60 * 1000; // 10 minutes
          const currentTime = Date.now();
    
          if (currentTime - otpIssuedTime > otpExpiryTime) {
            const newOtp = crypto.randomInt(100000, 999999);
    
    
            const subject = "Your OTP for Signup";
            const content = `<p>Your OTP for signup in Poster is <strong>${newOtp}</strong>. It is valid for 10 minutes. Thank you!</p>`;
    
            await sendMail(email, subject, content);
    
            existingUser.OTP = newOtp.toString();
            existingUser.updatedAt = new Date();
            await existingUser.save();
    
            return res.status(200).json({
              message: "OTP has expired. A new OTP has been sent to your email.",
              _id: existingUser._id,
            });
          } else {
            return res.status(409).json({ message: "Email already exists. Please verify OTP first." });
          }
        }
    
        // Generate OTP
        const otp = crypto.randomInt(100000, 999999);
        const subject = "Your OTP for Signup";
        const content = `<p>Your OTP for signup in Poster is <strong>${otp}</strong>. It is valid for 10 minutes. Thank you!</p>`;
    
        await sendMail(email, subject, content);

        const hashedPassword = await bcrypt.hash(password, 10);
    

        const newUser = new TeamPartner({
          email,
          password: hashedPassword,
          OTP: otp.toString(),
          email_verified: false,
          profile_verified: false,
        });
    
        await newUser.save();
    
        res.status(200).json({
          message: "OTP sent to your email. Please verify to complete signup.",
          _id: newUser._id,
        });
    
      } catch (error) {
        console.error("❌ Error in signupUser:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
      }
    };
    
    const company_Partner_Otp_verify = async (req, res) => {
          try {
            const { otp } = req.body;
            const { _id } = req.params;
        
            // Ensure ID is a valid ObjectId
            if (!ObjectId.isValid(_id)) {
              return res.status(400).json({ message: "Invalid user ID" });
            }
        
            const user = await TeamPartner.findOne({ _id: new ObjectId(_id) });
            if (!user) {
              return res.status(404).json({ message: "User not found" });
            }
        
            if (user.OTP !== otp) {
              return res.status(400).json({ message: "Invalid OTP" });
            }
        
            // OTP expiration check
            const otpIssuedTime = user.updatedAt.getTime();
            const otpExpiryTime = 10 * 60 * 1000;
            const currentTime = Date.now();
        
            if (currentTime - otpIssuedTime > otpExpiryTime) {
              return res.status(400).json({ message: "OTP has expired. Please request a new one." });
            }
        
            // Update email_verified field
            await TeamPartner.findByIdAndUpdate(
              user._id,
              { email_verified: true,      
                    token: generateToken(user._id) 
              },
              
              { new: true }
            );
        
            const token = generateToken(user._id);
            
        
            res.status(200).json({
              message: "Email successfully verified",
              token,
            });
          } catch (error) {
            console.error("Error in OTP verification:", error);
            res.status(500).json({ message: "Internal server error" });
          }
        };
    
        const company_Partner_Login = async (req, res) => {
          try {
            const { email, password } = req.body;
        
            if (!email || !password) {
              return res.status(400).json({ message: "Email and Password are required" });
            }
        
            const user = await TeamPartner.findOne({ email });
        
            if (!user) {
              return res.status(404).json({ message: "User not found. Please sign up first." });
            }
        

            const isPasswordValid = await bcrypt.compare(password, user.password);
            if (!isPasswordValid) {
              return res.status(401).json({ message: "Invalid password" });
            }
        
            if (!user.email_verified) {
              return res.status(400).json({ message: "Email not verified. Please verify your email first." });
            }
        
            const token = generateToken(user._id);
        
      
            user.token = token;
            await user.save();
        
            res.status(200).json({
              message: "Login successful",
              token,
              userId: user._id, 
            });
        
          } catch (error) {
            console.error("Error in login:", error);
            res.status(500).json({ message: "Internal server error", error: error.message });
          }
        };

        const register_company = async (req, res) => {
            try {
              // Extract token from headers
              const token = req.headers.authorization;
              if (!token) {
                return res.status(401).json({ message: "Unauthorized: No token provided" });
              }
          
              // Verify token and extract user ID
              const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
              const userId = decoded._id;
              console.log("Authenticated User ID:", userId);
          
              // Check if user exists
              const existingUser = await TeamPartner.findById(userId);
              if (!existingUser) {
                return res.status(404).json({ message: "User not found" });
              }
          
              // Extract fields from request body
              const {
                company_name,
                phone_number,
                pan_number,
                gstin_number,
                website,
                street_address,
                landmark,
                city,
                state,
                postal_code,
                authorized_person_name,
                authorized_person_phone,
                authorized_person_email,
                authorized_person_designation,
              } = req.body;
          
              // Validate required fields
              if (!company_name || !phone_number || !gstin_number) {
                return res.status(400).json({ message: "Missing required fields" });
              }
          
              // Check if phone number is already registered with another user
              const phoneExists = await TeamPartner.findOne({
                phone_number,
                _id: { $ne: userId },
              });
          
              if (phoneExists) {
                return res.status(409).json({ message: "Phone number already registered" });
              }
          
              // Prepare update object
              const updatedData = {
                company_name,
                phone_number,
                pan_number,
                gstin_number,
                website,
                street_address,
                landmark,
                city,
                state,
                postal_code,
                authorized_person_name,
                authorized_person_phone,
                authorized_person_email,
                authorized_person_designation,
                email_verified: true,
                profile_verified: existingUser.profile_verified || false,
                is_Active: true,
              };
          
              // Remove undefined values to prevent overwriting with `undefined`
              Object.keys(updatedData).forEach((key) => {
                if (updatedData[key] === undefined) {
                  delete updatedData[key];
                }
              });
          
              console.log("🔍 Updating with data:", updatedData);
          
              // Update user record
              const updatedUser = await TeamPartner.findByIdAndUpdate(
                userId,
                { $set: updatedData },
                { new: true, runValidators: true }
              );
          
              if (!updatedUser) {
                return res.status(500).json({ message: "Failed to update user profile" });
              }
          
              console.log("✅ Updated User:", updatedUser);
          
              res.status(200).json({
                message: "User profile updated successfully",
                data: updatedUser,
              });
            } catch (error) {
              console.error("❌ Error in registration:", error);
              res.status(500).json({ message: "Internal server error", error: error.message });
            }
          };
          


        module.exports = {company_Partner_Signup,company_Partner_Otp_verify,company_Partner_Login, register_company}