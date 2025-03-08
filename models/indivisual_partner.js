const mongoose = require("mongoose");

const indivisualPartnerSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      unique: false,
    },
    phone: {
      type: String,
    },
    alteratePhone: {
      type: String,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    token: {
      type: String,
    },
    profile_created_month: {
      type: Number,
    },
    profile_created_date: {
      type: Number,
    },
    OTP: {
      type: String,
    },
    isBlock: {
      type: Boolean,
      default: false,
    },
    email: {
      type: String,
      unique: true,
    },
    password: {
      type: String,
    },
    profile_verified: {
      type: Boolean,
      required: true,
    },
    street_address: {
      type: String,
      required: false,
    },
    landmark: {
      type: String,
    },
    city: {
      type: String,
      required: false,
    },
    state: {
      type: String,
      required: false,
    },
    postal_code: {
      type: String,
      required: false,
    },
    adhar_card_front_image: {
      type: String,
    },
    adhar_card_back_image: {
      type: String,
    },
    pan_card_number: {
      type: String,
    },
    gender: {
      type: String,
      // enum: ["Male", "Female", "Other"],
    },
        date_of_birth: {
      type: Date,
      required: false,
    },
    is_Active: {
      type: Boolean,
    },
    DOB: {
      type: Date,
    },
    rating: {
      type: Number,
      default: 1,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt
    collection: "indivisual_partner",
  }
);

// Create and export model
module.exports = mongoose.model("IndivisualPartner", indivisualPartnerSchema);
