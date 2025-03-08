const express = require("express");
const upload = require ("../utils/multer")

const { 
      company_Partner_Signup,company_Partner_Otp_verify,company_Partner_Login,register_company

} = require("../controllers/compay_partner_controller");

const router = express.Router();

router.post("/signup", company_Partner_Signup);
router.post("/otp_verify/:_id",company_Partner_Otp_verify );
router.post("/login", company_Partner_Login);
router.post("/register", register_company);


module.exports = router;