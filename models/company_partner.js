const mongoose = require("mongoose");

const companySchema = new mongoose.Schema(
  {
    // Company Details
    company_name: {
      type: String,
      required: false,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    email_verified: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: false,
    },
    phone_number: {
      type: String,
      // required: false,
    },
      OTP: {
      type: String,
    },
    // Business Information
    gstin_number: {
      type: String,
      required: false,
      unique: true,
    },
    pan_number: {
      type: String,
      required: false,
      unique: true,
    },
    website: {
      type: String,
      required: false, // Optional
    },

    // Address Details
    street_address: {
      type: String,
      required: false,
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

    // Authorized Person Details
    authorized_person_name: {
      type: String,
      required: false,
    },
    authorized_person_phone: {
      type: String,
      required: false,
    },
    authorized_person_email: {
      type: String,
      required: false,
    },
    authorized_person_designation: {
      type: String,
      required: false,
    },
    token: {
      type: String,
    },
    landmark: {
      type: String,
    },
    profile_created_month: {
      type: Number,
    },
    profile_created_date: {
      type: Number,
    },
    rating: {
      type: Number,
      default: 1,
    },
    is_Active: {
      type: Boolean,
    },
  },
  {
    timestamps: true, // Automatically adds createdAt & updatedAt fields
    collection: "company_partner", // MongoDB collection name
  }
);

module.exports = mongoose.model("company_partner", companySchema);
